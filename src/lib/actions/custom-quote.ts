"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail, notifyOps, formatLeadEmailHtml } from "@/lib/email";
import { customQuoteSchema, type CustomQuoteInput } from "@/lib/schemas/custom-quote";

interface QuoteResult {
  success: boolean;
  quoteId?: string;
  error?: string;
}

export async function submitCustomQuote(input: CustomQuoteInput): Promise<QuoteResult> {
  try {
    const validated = customQuoteSchema.parse(input);
    const supabase = await createServiceClient();

    // Get product details if product_id provided
    let productName = validated.product_name;
    if (validated.product_id && !productName) {
      const { data: product } = await supabase
        .from("products")
        .select("name, base_price_cents")
        .eq("id", validated.product_id)
        .single();

      if (product) {
        productName = product.name;
      }
    }

    // Create the quote record
    const { data: quote, error: quoteError } = await supabase
      .from("custom_quotes")
      .insert({
        product_id: validated.product_id || null,
        customer_email: validated.customer_email,
        customer_name: validated.customer_name,
        customer_phone: validated.customer_phone || null,
        requested_options: {
          category: validated.category,
          product_name: productName,
          size_preference: validated.size_preference,
          measurement_method: validated.measurement_method,
          need_by_date: validated.need_by_date,
          ...validated.requested_options,
        },
        measurement_profile_id: validated.measurement_profile_id || null,
        notes: validated.notes || null,
        reference_image_urls: validated.reference_image_urls || [],
        status: "received",
      })
      .select()
      .single();

    if (quoteError || !quote) {
      console.error("Failed to create quote:", quoteError);
      return { success: false, error: "Failed to submit quote request" };
    }

    // Send customer confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://weavers.studio";
    const categoryLabel = {
      shirt: "Custom Shirt",
      trouser: "Custom Trousers",
      denim: "Custom Denim",
      weddingwear: "Weddingwear",
      statement: "Statement Piece",
    }[validated.category];

    await sendEmail({
      to: validated.customer_email,
      subject: `Quote Request Received — ${productName || categoryLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #171717; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 32px; }
            .logo { font-size: 24px; font-weight: 600; color: #171717; letter-spacing: 0.05em; }
            .content { background: #F6F1E8; padding: 32px; border-radius: 8px; }
            .footer { margin-top: 32px; text-align: center; color: #8D8A84; font-size: 14px; }
            a { color: #1F4FFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WEAVERS ATELIER</div>
            </div>
            <div class="content">
              <h2 style="margin: 0 0 24px;">Thank you for your quote request${validated.customer_name ? `, ${validated.customer_name}` : ""}!</h2>
              
              <p>We've received your request for a custom ${productName || categoryLabel}. Our team will review your specifications and prepare a personalized quote for you.</p>
              
              <p><strong>What happens next:</strong></p>
              <ol style="margin: 16px 0; padding-left: 20px;">
                <li>Our design team reviews your request (usually within 24 hours)</li>
                <li>We'll email you a detailed quote with pricing and timeline</li>
                <li>Once you approve, we'll send an invoice to secure your order</li>
                <li>After payment, production begins on your custom piece</li>
              </ol>
              
              ${validated.notes ? `<p style="background: #fff; padding: 16px; border-radius: 4px; margin-top: 24px;"><strong>Your notes:</strong><br>${validated.notes}</p>` : ""}
              
              <p style="margin-top: 24px;">If you have any questions, reply to this email or reach us on WhatsApp.</p>
            </div>
            <div class="footer">
              <p>Weavers Atelier — Custom Menswear, Made for You</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Notify ops team
    await notifyOps(
      `New Quote Request: ${productName || categoryLabel}`,
      formatLeadEmailHtml({
        "Product": productName || categoryLabel,
        "Category": validated.category,
        "Customer Name": validated.customer_name,
        "Customer Email": validated.customer_email,
        "Customer Phone": validated.customer_phone || "Not provided",
        "Size Preference": validated.size_preference || "Custom",
        "Need By Date": validated.need_by_date || "No deadline specified",
        "Notes": validated.notes || "None",
        "Reference Images": validated.reference_image_urls?.length
          ? `${validated.reference_image_urls.length} image(s) uploaded`
          : "None",
        "Admin Link": `${baseUrl}/admin/quotes/${quote.id}`,
      }),
      validated.customer_email
    );

    return { success: true, quoteId: quote.id };
  } catch (error) {
    console.error("Quote submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit quote request",
    };
  }
}
