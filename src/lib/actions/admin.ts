"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getStripeServer } from "@/lib/stripe";
import type {
  ProductStatus,
  ProductCategory,
  SizeOption,
  EcommerceOrderStatus,
  QuoteStatus,
} from "@/lib/supabase/types";

// ================================
// PRODUCTS
// ================================

export interface ProductFormData {
  name: string;
  slug: string;
  collection_id: string | null;
  description: string;
  base_price_cents: number;
  lead_time_days: number;
  custom_available: boolean;
  rtw_available: boolean;
  sizes: SizeOption[];
  category: ProductCategory;
  status: ProductStatus;
  seo_title: string;
  seo_description: string;
}

export async function createProduct(
  data: ProductFormData
): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: data.name,
        slug: data.slug,
        collection_id: data.collection_id || null,
        description: data.description,
        base_price_cents: data.base_price_cents,
        currency: "USD",
        lead_time_days: data.lead_time_days,
        custom_available: data.custom_available,
        rtw_available: data.rtw_available,
        sizes: data.sizes,
        category: data.category,
        status: data.status,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        sort_order: 0,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Error in createProduct:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProduct(
  productId: string,
  data: Partial<ProductFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("products")
      .update({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.collection_id !== undefined && {
          collection_id: data.collection_id || null,
        }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.base_price_cents !== undefined && {
          base_price_cents: data.base_price_cents,
        }),
        ...(data.lead_time_days !== undefined && {
          lead_time_days: data.lead_time_days,
        }),
        ...(data.custom_available !== undefined && {
          custom_available: data.custom_available,
        }),
        ...(data.rtw_available !== undefined && {
          rtw_available: data.rtw_available,
        }),
        ...(data.sizes && { sizes: data.sizes }),
        ...(data.category && { category: data.category }),
        ...(data.status && { status: data.status }),
        ...(data.seo_title !== undefined && {
          seo_title: data.seo_title || null,
        }),
        ...(data.seo_description !== undefined && {
          seo_description: data.seo_description || null,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Delete product images first
    await supabase.from("product_images").delete().eq("product_id", productId);

    // Delete product options
    await supabase.from("product_options").delete().eq("product_id", productId);

    // Delete the product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addProductImage(
  productId: string,
  url: string,
  alt: string | null,
  isPrimary: boolean
): Promise<{ success: boolean; imageId?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // If this is marked as primary, unset other primaries first
    if (isPrimary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    // Get current max sort order
    const { data: existingImages } = await supabase
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = existingImages?.[0]?.sort_order
      ? existingImages[0].sort_order + 1
      : 0;

    const { data: image, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        alt,
        is_primary: isPrimary,
        sort_order: nextSortOrder,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error adding product image:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/products/${productId}`);

    return { success: true, imageId: image.id };
  } catch (error) {
    console.error("Error in addProductImage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProductImage(
  imageId: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      console.error("Error deleting product image:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/products/${productId}`);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteProductImage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// COLLECTIONS
// ================================

export interface CollectionFormData {
  name: string;
  slug: string;
  category: ProductCategory;
  description: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
}

export async function createCollection(
  data: CollectionFormData
): Promise<{ success: boolean; collectionId?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description,
        hero_image_url: data.hero_image_url,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        published_at: data.published_at,
        sort_order: 0,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/collections");
    revalidatePath("/shop");

    return { success: true, collectionId: collection.id };
  } catch (error) {
    console.error("Error in createCollection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCollection(
  collectionId: string,
  data: Partial<CollectionFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("collections")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectionId);

    if (error) {
      console.error("Error updating collection:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/collections");
    revalidatePath(`/admin/collections/${collectionId}`);
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Error in updateCollection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCollection(
  collectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Unlink products from this collection
    await supabase
      .from("products")
      .update({ collection_id: null })
      .eq("collection_id", collectionId);

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (error) {
      console.error("Error deleting collection:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/collections");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteCollection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// ORDERS
// ================================

export async function updateOrderStatus(
  orderId: string,
  status: EcommerceOrderStatus,
  additionalData?: {
    tracking_number?: string;
    tracking_url?: string;
    internal_notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "shipped" && !additionalData?.tracking_url) {
      // Set shipped_at timestamp
      updateData.shipped_at = new Date().toISOString();
    }

    if (additionalData?.tracking_number) {
      updateData.tracking_number = additionalData.tracking_number;
    }
    if (additionalData?.tracking_url) {
      updateData.tracking_url = additionalData.tracking_url;
      updateData.shipped_at = new Date().toISOString();
    }
    if (additionalData?.internal_notes) {
      updateData.internal_notes = additionalData.internal_notes;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function refundOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();
    const stripe = getStripeServer();

    // Get order details
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("stripe_payment_intent_id, total_cents")
      .eq("id", orderId)
      .single();

    if (fetchError || !order?.stripe_payment_intent_id) {
      return { success: false, error: "Order not found or no payment intent" };
    }

    // Create refund in Stripe
    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
    });

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "refunded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order after refund:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Error in refundOrder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// CUSTOM QUOTES
// ================================

export async function updateQuoteStatus(
  quoteId: string,
  data: {
    status: QuoteStatus;
    quoted_price_cents?: number | null;
    quoted_lead_time_days?: number | null;
    internal_notes?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const updateData: Record<string, unknown> = {
      status: data.status,
      updated_at: new Date().toISOString(),
    };

    if (data.quoted_price_cents !== undefined) {
      updateData.quoted_price_cents = data.quoted_price_cents;
    }
    if (data.quoted_lead_time_days !== undefined) {
      updateData.quoted_lead_time_days = data.quoted_lead_time_days;
    }
    if (data.internal_notes !== undefined) {
      updateData.internal_notes = data.internal_notes;
    }

    // Set expiration for quoted status
    if (data.status === "quoted") {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // 14 day expiration
      updateData.expires_at = expiresAt.toISOString();
    }

    const { error } = await supabase
      .from("custom_quotes")
      .update(updateData)
      .eq("id", quoteId);

    if (error) {
      console.error("Error updating quote status:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${quoteId}`);

    return { success: true };
  } catch (error) {
    console.error("Error in updateQuoteStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendQuoteInvoice(
  quoteId: string
): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();
    const stripe = getStripeServer();

    // Get quote details
    const { data: quote, error: fetchError } = await supabase
      .from("custom_quotes")
      .select(
        `
        *,
        products (
          name
        )
      `
      )
      .eq("id", quoteId)
      .single();

    if (fetchError || !quote) {
      return { success: false, error: "Quote not found" };
    }

    if (!quote.quoted_price_cents) {
      return { success: false, error: "Quote price not set" };
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;

    const existingCustomers = await stripe.customers.list({
      email: quote.customer_email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: quote.customer_email,
        name: quote.customer_name,
        phone: quote.customer_phone || undefined,
        metadata: {
          quote_id: quoteId,
        },
      });
      stripeCustomerId = newCustomer.id;
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      metadata: {
        quote_id: quoteId,
      },
    });

    // Add line item
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: invoice.id,
      amount: quote.quoted_price_cents,
      currency: "usd",
      description: `Custom ${quote.products?.name || "Order"} - Quote #${quoteId.slice(
        0,
        8
      )}`,
    });

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

    // Update quote with invoice details
    const { error: updateError } = await supabase
      .from("custom_quotes")
      .update({
        status: "invoiced",
        stripe_invoice_id: invoice.id,
        stripe_invoice_url: finalizedInvoice.hosted_invoice_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quoteId);

    if (updateError) {
      console.error("Error updating quote with invoice:", updateError);
    }

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${quoteId}`);

    return {
      success: true,
      invoiceUrl: finalizedInvoice.hosted_invoice_url || undefined,
    };
  } catch (error) {
    console.error("Error in sendQuoteInvoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createStripeInvoiceForQuote(
  quoteId: string,
  data: {
    customer_email: string;
    customer_name: string;
    amount_cents: number;
    description: string;
    lead_time_days?: number;
  }
): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();
    const stripe = getStripeServer();

    // Get or create Stripe customer
    let stripeCustomerId: string;

    const existingCustomers = await stripe.customers.list({
      email: data.customer_email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: data.customer_email,
        name: data.customer_name,
        metadata: {
          quote_id: quoteId,
        },
      });
      stripeCustomerId = newCustomer.id;
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      metadata: {
        quote_id: quoteId,
        lead_time_days: data.lead_time_days?.toString() || "",
      },
    });

    // Add line item
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: invoice.id,
      amount: data.amount_cents,
      currency: "usd",
      description: data.description,
    });

    // Finalize and send invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

    // Update quote with invoice details
    const { error: updateError } = await supabase
      .from("custom_quotes")
      .update({
        status: "invoiced",
        stripe_invoice_id: invoice.id,
        stripe_invoice_url: finalizedInvoice.hosted_invoice_url,
        quoted_price_cents: data.amount_cents,
        quoted_lead_time_days: data.lead_time_days || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quoteId);

    if (updateError) {
      console.error("Error updating quote with invoice:", updateError);
    }

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${quoteId}`);

    return {
      success: true,
      invoiceUrl: finalizedInvoice.hosted_invoice_url || undefined,
    };
  } catch (error) {
    console.error("Error in createStripeInvoiceForQuote:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// EMAIL TEMPLATES
// ================================

export async function updateEmailTemplate(
  key: string,
  data: {
    subject?: string;
    html_body?: string;
    text_body?: string | null;
    variables?: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Check if template exists
    const { data: existing } = await supabase
      .from("email_templates")
      .select("id")
      .eq("key", key)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("email_templates")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("key", key);

      if (error) {
        console.error("Error updating email template:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from("email_templates")
        .insert({
          key,
          subject: data.subject || "",
          html_body: data.html_body || "",
          text_body: data.text_body || null,
          variables: data.variables || [],
        });

      if (error) {
        console.error("Error creating email template:", error);
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/admin/email-templates");
    revalidatePath(`/admin/email-templates/${key}`);

    return { success: true };
  } catch (error) {
    console.error("Error in updateEmailTemplate:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// SETTINGS
// ================================

export async function updateSetting(
  key: string,
  value: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Upsert the setting
    const { error } = await supabase.from("settings").upsert(
      {
        key,
        value: value as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("Error updating setting:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error in updateSetting:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateSettings(
  settings: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Store all settings as a single row with key="site_settings"
    const { error } = await supabase.from("settings").upsert(
      {
        key: "site_settings",
        value: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("Error updating settings:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error in updateSettings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ================================
// IMAGE UPLOAD
// ================================

export async function getUploadUrl(
  filename: string,
  contentType: string
): Promise<{ success: boolean; uploadUrl?: string; publicUrl?: string; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // Generate unique filename
    const ext = filename.split(".").pop();
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const path = `products/${uniqueFilename}`;

    // Upload will be handled client-side, we just prepare the path
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    return {
      success: true,
      uploadUrl: path,
      publicUrl: data.publicUrl,
    };
  } catch (error) {
    console.error("Error in getUploadUrl:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
