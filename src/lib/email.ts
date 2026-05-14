import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

const OPS_EMAIL = process.env.OPS_EMAIL || "orders@weavers.studio";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: "Weavers Atelier <noreply@weavers.studio>",
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("Email send error:", error);
      return { ok: false, error };
    }

    return { ok: true, data };
  } catch (error) {
    console.error("Email send exception:", error);
    return { ok: false, error };
  }
}

export async function notifyOps(subject: string, html: string, replyTo?: string) {
  return sendEmail({
    to: OPS_EMAIL,
    subject: `[Weavers] ${subject}`,
    html,
    replyTo,
  });
}

export async function sendCustomerConfirmation(
  customerEmail: string,
  customerName: string,
  type: "inquiry" | "consultation" | "order" | "measurement"
) {
  const subjects = {
    inquiry: "We received your inquiry",
    consultation: "Your consultation request is confirmed",
    order: "Your custom order request is received",
    measurement: "We received your measurements",
  };

  const html = `
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
          <p>Dear ${customerName},</p>
          <p>Thank you for reaching out to Weavers Atelier. We've received your ${type === "inquiry" ? "inquiry" : type === "consultation" ? "consultation request" : type === "order" ? "custom order request" : "measurements"}.</p>
          <p>Our team will review the details and get back to you within 24-48 hours. If you have any urgent questions, feel free to reach us on WhatsApp.</p>
          <p>Best regards,<br>The Weavers Team</p>
        </div>
        <div class="footer">
          <p>Weavers Atelier — Custom Menswear, Made for You</p>
          <p><a href="https://instagram.com/itsweavers">@itsweavers</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: subjects[type],
    html,
  });
}

export function formatLeadEmailHtml(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(
      ([key, value]) =>
        `<tr><td style="padding: 8px; border-bottom: 1px solid #E8DFD2; font-weight: 500;">${formatKey(key)}</td><td style="padding: 8px; border-bottom: 1px solid #E8DFD2;">${formatValue(value)}</td></tr>`
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      ${rows}
    </table>
  `;
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  items: { name: string; size: string; quantity: number; price: string }[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  estimatedShipDate?: string;
  trackUrl?: string;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8DFD2;">
          ${item.name} (${item.size}) × ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E8DFD2; text-align: right;">
          ${item.price}
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
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
        .order-number { font-size: 14px; color: #8D8A84; margin-bottom: 16px; }
        .footer { margin-top: 32px; text-align: center; color: #8D8A84; font-size: 14px; }
        a { color: #1F4FFF; }
        .btn { display: inline-block; padding: 12px 24px; background: #171717; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; }
        .totals td { padding: 8px 0; }
        .totals .total-row td { font-weight: 600; font-size: 18px; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">WEAVERS ATELIER</div>
        </div>
        <div class="content">
          <p class="order-number">Order #${data.orderNumber}</p>
          <h2 style="margin: 0 0 24px;">Thank you for your order${data.customerName ? `, ${data.customerName}` : ""}!</h2>
          <p>Your order has been confirmed and we're getting started on it.</p>
          
          ${data.estimatedShipDate ? `<p><strong>Estimated ship date:</strong> ${data.estimatedShipDate}</p>` : ""}
          
          <h3 style="margin-top: 32px; margin-bottom: 16px;">Order Details</h3>
          <table>
            ${itemsHtml}
          </table>
          
          <table class="totals" style="margin-top: 16px;">
            <tr>
              <td>Subtotal</td>
              <td style="text-align: right;">${data.subtotal}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td style="text-align: right;">${data.shipping}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td style="text-align: right;">${data.tax}</td>
            </tr>
            <tr class="total-row">
              <td>Total</td>
              <td style="text-align: right;">${data.total}</td>
            </tr>
          </table>
          
          ${data.trackUrl ? `<p style="margin-top: 32px;"><a href="${data.trackUrl}" class="btn">Track Your Order</a></p>` : ""}
        </div>
        <div class="footer">
          <p>Questions? Reply to this email or contact us on WhatsApp.</p>
          <p>Weavers Atelier — Custom Menswear, Made for You</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Order Confirmed — #${data.orderNumber}`,
    html,
  });
}
