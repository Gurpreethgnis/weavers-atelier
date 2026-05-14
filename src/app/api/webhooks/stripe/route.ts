import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, notifyOps, formatLeadEmailHtml } from "@/lib/email";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  const stripe = getStripeServer();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(supabase, session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(supabase, paymentIntent);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(supabase, charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  session: Stripe.Checkout.Session
) {
  // Check if order already exists
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, status")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (existingOrder) {
    // Order already exists, just update status
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("id", existingOrder.id);

    console.log(`Order ${existingOrder.id} confirmed via checkout session ${session.id}`);
    return;
  }

  // Parse the items from session metadata
  const metadata = session.metadata || {};
  const itemsJson = metadata.items;
  const leadTimeDays = parseInt(metadata.lead_time_days || "14", 10);

  let cartItems: { productId: string; size: string; quantity: number }[] = [];
  try {
    cartItems = itemsJson ? JSON.parse(itemsJson) : [];
  } catch {
    console.error("Failed to parse cart items from session metadata");
  }

  // Get or create customer
  let customerId: string | null = null;
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const customerPhone = session.customer_details?.phone;

  if (customerEmail) {
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customerEmail)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone,
          stripe_customer_id: session.customer as string || null,
        })
        .select()
        .single();

      customerId = newCustomer?.id || null;
    }
  }

  // Calculate estimated ship date
  const estimatedShipDate = new Date();
  estimatedShipDate.setDate(estimatedShipDate.getDate() + leadTimeDays);

  // Create the order
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_email: customerEmail,
      order_type: "rtw",
      status: "confirmed",
      subtotal_cents: session.amount_subtotal || 0,
      tax_cents: session.total_details?.amount_tax || 0,
      shipping_cents: session.total_details?.amount_shipping || 0,
      total_cents: session.amount_total || 0,
      currency: (session.currency || "usd").toUpperCase(),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      lead_time_days: leadTimeDays,
      estimated_ship_date: estimatedShipDate.toISOString(),
    })
    .select()
    .single();

  if (orderError || !newOrder) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Fetch product details for snapshots
  const productIds = cartItems.map((item) => item.productId);
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      base_price_cents,
      product_images (url, is_primary)
    `
    )
    .in("id", productIds);

  const productMap = new Map(
    products?.map((p) => [
      p.id,
      {
        name: p.name,
        price_cents: p.base_price_cents,
        image: p.product_images?.find((img: { is_primary: boolean }) => img.is_primary)?.url ||
               p.product_images?.[0]?.url ||
               null,
      },
    ]) || []
  );

  // Create order items
  const orderItems = cartItems.map((item) => {
    const productInfo = productMap.get(item.productId) || {
      name: "Product",
      price_cents: 0,
      image: null,
    };

    return {
      order_id: newOrder.id,
      product_id: item.productId,
      product_snapshot: productInfo,
      size: item.size,
      unit_price_cents: productInfo.price_cents,
      quantity: item.quantity,
      line_total_cents: productInfo.price_cents * item.quantity,
    };
  });

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Failed to create order items:", itemsError);
    }
  }

  console.log(
    `Order ${newOrder.order_number} created from checkout session ${session.id}`
  );

  // Send confirmation email
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://weavers.studio";
  const orderItemsForEmail = orderItems.map((item) => ({
    name: (item.product_snapshot as { name: string }).name,
    size: item.size,
    quantity: item.quantity,
    price: `$${(item.line_total_cents / 100).toFixed(2)}`,
  }));

  try {
    await sendOrderConfirmation({
      orderNumber: newOrder.order_number,
      customerEmail: customerEmail || "",
      customerName: customerName || undefined,
      items: orderItemsForEmail,
      subtotal: `$${((session.amount_subtotal || 0) / 100).toFixed(2)}`,
      shipping: session.total_details?.amount_shipping
        ? `$${(session.total_details.amount_shipping / 100).toFixed(2)}`
        : "Free",
      tax: `$${((session.total_details?.amount_tax || 0) / 100).toFixed(2)}`,
      total: `$${((session.amount_total || 0) / 100).toFixed(2)}`,
      estimatedShipDate: estimatedShipDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      trackUrl: `${baseUrl}/track/${newOrder.track_token}`,
    });

    // Notify ops team
    await notifyOps(
      `New Order: ${newOrder.order_number}`,
      formatLeadEmailHtml({
        "Order Number": newOrder.order_number,
        "Customer Email": customerEmail,
        "Customer Name": customerName,
        "Total": `$${((session.amount_total || 0) / 100).toFixed(2)}`,
        "Items": orderItemsForEmail.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join(", "),
        "Estimated Ship Date": estimatedShipDate.toLocaleDateString(),
      }),
      customerEmail || undefined
    );
  } catch (emailError) {
    console.error("Failed to send order confirmation email:", emailError);
  }
}

async function handlePaymentIntentSucceeded(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  paymentIntent: Stripe.PaymentIntent
) {
  // This might be a duplicate of checkout.session.completed
  // but we handle it for completeness
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (order && order.status === "payment_pending") {
    await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", order.id);

    console.log(`Order ${order.id} confirmed via payment intent`);
  }
}

async function handleInvoicePaid(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  invoice: Stripe.Invoice
) {
  // Find the custom quote by Stripe invoice ID
  const { data: quote, error: findError } = await supabase
    .from("custom_quotes")
    .select("*, products(*)")
    .eq("stripe_invoice_id", invoice.id)
    .single();

  if (findError || !quote) {
    console.error("Custom quote not found for invoice:", invoice.id);
    return;
  }

  // Update quote status to paid
  await supabase
    .from("custom_quotes")
    .update({ status: "paid" })
    .eq("id", quote.id);

  // Create an order from the paid quote
  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_email: quote.customer_email,
      order_type: "custom",
      status: "confirmed",
      subtotal_cents: quote.quoted_price_cents || 0,
      tax_cents: 0, // Custom quotes handle tax separately if needed
      shipping_cents: 0,
      total_cents: quote.quoted_price_cents || 0,
      currency: "USD",
      stripe_invoice_id: invoice.id,
      lead_time_days: quote.quoted_lead_time_days,
    })
    .select()
    .single();

  if (orderError || !newOrder) {
    console.error("Failed to create order from quote:", orderError);
    return;
  }

  // Create order item
  await supabase.from("order_items").insert({
    order_id: newOrder.id,
    product_id: quote.product_id,
    product_snapshot: {
      name: quote.products?.name || "Custom Order",
      image: null,
      price_cents: quote.quoted_price_cents,
      options: quote.requested_options,
    },
    size: "custom",
    unit_price_cents: quote.quoted_price_cents || 0,
    quantity: 1,
    line_total_cents: quote.quoted_price_cents || 0,
    custom_quote_id: quote.id,
  });

  console.log(`Order ${newOrder.order_number} created from paid invoice ${invoice.id}`);

  // Send order confirmation email for custom order
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://weavers.studio";
  const productName = (quote.products as { name?: string } | null)?.name || "Custom Order";

  try {
    await sendOrderConfirmation({
      orderNumber: newOrder.order_number,
      customerEmail: quote.customer_email,
      customerName: quote.customer_name || undefined,
      items: [
        {
          name: productName,
          size: "Custom",
          quantity: 1,
          price: `$${((quote.quoted_price_cents || 0) / 100).toFixed(2)}`,
        },
      ],
      subtotal: `$${((quote.quoted_price_cents || 0) / 100).toFixed(2)}`,
      shipping: "Included",
      tax: "Included",
      total: `$${((quote.quoted_price_cents || 0) / 100).toFixed(2)}`,
      estimatedShipDate: quote.quoted_lead_time_days
        ? (() => {
            const date = new Date();
            date.setDate(date.getDate() + quote.quoted_lead_time_days);
            return date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          })()
        : undefined,
      trackUrl: `${baseUrl}/track/${newOrder.track_token}`,
    });

    // Notify ops team
    await notifyOps(
      `Custom Order Paid: ${newOrder.order_number}`,
      formatLeadEmailHtml({
        "Order Number": newOrder.order_number,
        "Quote ID": quote.id,
        "Product": productName,
        "Customer Email": quote.customer_email,
        "Customer Name": quote.customer_name,
        "Total": `$${((quote.quoted_price_cents || 0) / 100).toFixed(2)}`,
        "Lead Time": `${quote.quoted_lead_time_days || "TBD"} days`,
      }),
      quote.customer_email
    );
  } catch (emailError) {
    console.error("Failed to send custom order confirmation email:", emailError);
  }
}

async function handleInvoicePaymentFailed(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  invoice: Stripe.Invoice
) {
  // Find and update the quote status
  const { data: quote } = await supabase
    .from("custom_quotes")
    .select("id")
    .eq("stripe_invoice_id", invoice.id)
    .single();

  if (quote) {
    // Keep status as invoiced but log the failure
    console.error(`Invoice payment failed for quote ${quote.id}`);
    // Could add internal notes or send notification
  }
}

async function handleChargeRefunded(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  charge: Stripe.Charge
) {
  // Find order by payment intent
  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", charge.payment_intent)
    .single();

  if (order) {
    // Check if fully refunded
    if (charge.amount_refunded === charge.amount) {
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id);

      console.log(`Order ${order.id} fully refunded and cancelled`);
    } else {
      console.log(
        `Order ${order.id} partially refunded: ${charge.amount_refunded}/${charge.amount}`
      );
    }
  }
}
