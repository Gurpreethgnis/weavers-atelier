"use server";

import { getStripeServer } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/store/cart";

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface CheckoutInput {
  items: CartItem[];
  customerEmail?: string;
}

export async function createCheckoutSession(
  input: CheckoutInput
): Promise<CheckoutResult> {
  try {
    const { items, customerEmail } = input;

    if (!items || items.length === 0) {
      return { success: false, error: "No items in cart" };
    }

    const stripe = getStripeServer();
    const supabase = await createServiceClient();

    // Fetch product details from Supabase to ensure prices are correct
    const productIds = items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, base_price_cents, slug, lead_time_days")
      .in("id", productIds);

    if (productsError || !products) {
      return { success: false, error: "Failed to fetch products" };
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Build line items for Stripe
    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId);
      const price = product?.base_price_cents || item.price_cents;
      const name = product?.name || item.name;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${name} (${item.size})`,
            metadata: {
              product_id: item.productId,
              size: item.size,
            },
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      };
    });

    // Calculate max lead time for the order
    const maxLeadTime = Math.max(
      ...items.map((item) => {
        const product = productMap.get(item.productId);
        return product?.lead_time_days || 14;
      })
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: customerEmail,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
          "AT",
          "CH",
          "SE",
          "DK",
          "NO",
          "FI",
          "IE",
          "PT",
          "NZ",
          "SG",
          "HK",
          "JP",
          "AE",
          "IN",
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "US Domestic (Free)",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: maxLeadTime + 3,
              },
              maximum: {
                unit: "business_day",
                value: maxLeadTime + 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 2500,
              currency: "usd",
            },
            display_name: "International",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: maxLeadTime + 7,
              },
              maximum: {
                unit: "business_day",
                value: maxLeadTime + 14,
              },
            },
          },
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        order_type: "rtw",
        lead_time_days: String(maxLeadTime),
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          }))
        ),
      },
    });

    if (!session.url) {
      return { success: false, error: "Failed to create checkout session" };
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Checkout failed",
    };
  }
}
