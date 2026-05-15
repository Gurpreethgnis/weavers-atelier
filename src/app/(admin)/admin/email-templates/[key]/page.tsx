"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, Code } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { updateEmailTemplate } from "@/lib/actions/admin";

const templateMeta: Record<
  string,
  {
    description: string;
    variables: string[];
    defaultSubject: string;
    defaultHtml: string;
  }
> = {
  order_confirmed: {
    description: "Sent when a customer completes checkout",
    variables: ["order_number", "customer_name", "total", "items", "track_url"],
    defaultSubject: "Order Confirmed - {{order_number}}",
    defaultHtml: `<h1>Thank you for your order, {{customer_name}}!</h1>
<p>Your order <strong>{{order_number}}</strong> has been confirmed.</p>
<p>Order Total: <strong>{{total}}</strong></p>
<h2>Items:</h2>
{{items}}
<p><a href="{{track_url}}">Track your order</a></p>`,
  },
  order_dispatched: {
    description: "Sent when order is marked as shipped",
    variables: [
      "order_number",
      "customer_name",
      "tracking_url",
      "estimated_delivery",
    ],
    defaultSubject: "Your Order Has Shipped - {{order_number}}",
    defaultHtml: `<h1>Your order is on its way, {{customer_name}}!</h1>
<p>Order <strong>{{order_number}}</strong> has been shipped.</p>
<p>Estimated delivery: {{estimated_delivery}}</p>
<p><a href="{{tracking_url}}">Track your package</a></p>`,
  },
  quote_received: {
    description: "Sent when a custom quote request is submitted",
    variables: ["customer_name", "product_name", "quote_id"],
    defaultSubject: "We Received Your Custom Quote Request",
    defaultHtml: `<h1>Thank you for your custom quote request, {{customer_name}}!</h1>
<p>We've received your request for a custom <strong>{{product_name}}</strong>.</p>
<p>Our team will review your specifications and get back to you with a quote shortly.</p>
<p>Reference: {{quote_id}}</p>`,
  },
  quote_invoice_sent: {
    description: "Sent when admin creates invoice for a quote",
    variables: [
      "customer_name",
      "product_name",
      "quoted_price",
      "lead_time",
      "invoice_url",
    ],
    defaultSubject: "Your Custom Quote is Ready - Invoice Attached",
    defaultHtml: `<h1>Your custom quote is ready, {{customer_name}}!</h1>
<p>We've prepared a quote for your custom <strong>{{product_name}}</strong>.</p>
<p>Quoted Price: <strong>{{quoted_price}}</strong></p>
<p>Estimated Lead Time: {{lead_time}} days</p>
<p><a href="{{invoice_url}}">View and pay your invoice</a></p>`,
  },
  quote_paid: {
    description: "Sent when customer pays a custom quote invoice",
    variables: ["customer_name", "product_name", "order_number", "track_url"],
    defaultSubject: "Payment Received - Your Custom Order is Confirmed",
    defaultHtml: `<h1>Payment received, {{customer_name}}!</h1>
<p>Your custom <strong>{{product_name}}</strong> order has been confirmed.</p>
<p>Order Number: <strong>{{order_number}}</strong></p>
<p>We'll begin crafting your piece right away.</p>
<p><a href="{{track_url}}">Track your order</a></p>`,
  },
  account_welcome: {
    description: "Sent when a customer creates an account",
    variables: ["customer_name"],
    defaultSubject: "Welcome to Weaver's Atelier",
    defaultHtml: `<h1>Welcome to Weaver's Atelier, {{customer_name}}!</h1>
<p>Your account has been created successfully.</p>
<p>You can now:</p>
<ul>
<li>Track your orders</li>
<li>Save your measurements</li>
<li>Manage your addresses</li>
</ul>`,
  },
};

export default function EditEmailTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const key = params.key as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [textBody, setTextBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const meta = templateMeta[key];

  useEffect(() => {
    async function loadTemplate() {
      const { data } = await supabase
        .from("email_templates")
        .select("subject, html_body, text_body")
        .eq("key", key)
        .single();

      const template = data as { subject: string | null; html_body: string | null; text_body: string | null } | null;

      if (template) {
        setSubject(template.subject || meta?.defaultSubject || "");
        setHtmlBody(template.html_body || meta?.defaultHtml || "");
        setTextBody(template.text_body || "");
      } else if (meta) {
        setSubject(meta.defaultSubject);
        setHtmlBody(meta.defaultHtml);
      }
      setLoading(false);
    }
    loadTemplate();
  }, [key, supabase, meta]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateEmailTemplate(key, {
        subject,
        html_body: htmlBody,
        text_body: textBody,
        variables: meta?.variables || [],
      });

      if (result.success) {
        toast.success("Template saved");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  // Generate preview by replacing variables with sample data
  const getPreviewHtml = () => {
    let preview = htmlBody;
    const sampleData: Record<string, string> = {
      order_number: "WA-20260514-001",
      customer_name: "John Doe",
      total: "$299.00",
      items: "<ul><li>Custom Shirt × 1 - $299.00</li></ul>",
      track_url: "https://weaversatelier.com/track/abc123",
      tracking_url: "https://ups.com/track/1Z999",
      estimated_delivery: "May 28, 2026",
      product_name: "Oxford Shirt",
      quote_id: "Q-12345",
      quoted_price: "$450.00",
      lead_time: "14",
      invoice_url: "https://invoice.stripe.com/i/abc123",
    };

    for (const [k, v] of Object.entries(sampleData)) {
      preview = preview.replace(new RegExp(`{{${k}}}`, "g"), v);
    }
    return preview;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Template not found</p>
        <Link href="/admin/email-templates" className="text-blue-600 mt-2 inline-block">
          Back to templates
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/email-templates"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {key.replace(/_/g, " ")}
            </h1>
            <p className="text-sm text-gray-500">{meta.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {showPreview ? (
                <>
                  <Code className="w-4 h-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Template
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Subject */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email subject..."
            />
          </div>

          {/* HTML Body */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Body
            </label>
            {showPreview ? (
              <div
                className="prose max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
              />
            ) : (
              <textarea
                value={htmlBody}
                onChange={(e) => setHtmlBody(e.target.value)}
                rows={16}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="<h1>Email content...</h1>"
              />
            )}
          </div>

          {/* Plain Text Body */}
          {!showPreview && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plain Text Body (Optional)
              </label>
              <textarea
                value={textBody}
                onChange={(e) => setTextBody(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Plain text version for email clients that don't support HTML..."
              />
              <p className="text-xs text-gray-500 mt-2">
                If left empty, a plain text version will be auto-generated from the
                HTML.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Variables */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Available Variables
            </h3>
            <div className="space-y-2">
              {meta.variables.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    navigator.clipboard.writeText(`{{${v}}}`);
                    toast.success("Copied to clipboard");
                  }}
                  className="block w-full text-left px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  <code className="text-blue-600">{`{{${v}}}`}</code>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click to copy. Variables will be replaced with actual values when the
              email is sent.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use inline CSS for best email client support</li>
              <li>• Keep emails simple and scannable</li>
              <li>• Test with multiple email clients</li>
              <li>• Include a plain text fallback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
