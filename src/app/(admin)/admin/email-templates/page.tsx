import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEmailTemplatesPage() {
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from("email_templates")
    .select("*")
    .order("key");

  // Default templates if none exist
  const defaultTemplates = [
    {
      key: "order_confirmed",
      subject: "Order Confirmed - {{order_number}}",
      description: "Sent when a customer completes checkout",
      variables: ["order_number", "customer_name", "total", "items", "track_url"],
    },
    {
      key: "order_dispatched",
      subject: "Your Order Has Shipped - {{order_number}}",
      description: "Sent when order is marked as shipped",
      variables: [
        "order_number",
        "customer_name",
        "tracking_url",
        "estimated_delivery",
      ],
    },
    {
      key: "quote_received",
      subject: "We Received Your Custom Quote Request",
      description: "Sent when a custom quote request is submitted",
      variables: ["customer_name", "product_name", "quote_id"],
    },
    {
      key: "quote_invoice_sent",
      subject: "Your Custom Quote is Ready - Invoice Attached",
      description: "Sent when admin creates invoice for a quote",
      variables: [
        "customer_name",
        "product_name",
        "quoted_price",
        "lead_time",
        "invoice_url",
      ],
    },
    {
      key: "quote_paid",
      subject: "Payment Received - Your Custom Order is Confirmed",
      description: "Sent when customer pays a custom quote invoice",
      variables: ["customer_name", "product_name", "order_number", "track_url"],
    },
    {
      key: "account_welcome",
      subject: "Welcome to Weaver's Atelier",
      description: "Sent when a customer creates an account",
      variables: ["customer_name"],
    },
  ];

  // Merge existing templates with defaults
  const allTemplates = defaultTemplates.map((def) => {
    const existing = templates?.find((t) => t.key === def.key);
    return {
      ...def,
      id: existing?.id,
      html_body: existing?.html_body,
      text_body: existing?.text_body,
      subject: existing?.subject || def.subject,
      exists: !!existing,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Template
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                Variables
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allTemplates.map((template) => (
              <tr key={template.key} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {template.key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-gray-700">{template.subject}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((v) => (
                      <code
                        key={v}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {`{{${v}}}`}
                      </code>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{template.variables.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      template.exists
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {template.exists ? "Customized" : "Default"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/email-templates/${template.key}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Template Variables</h3>
        <p className="text-sm text-blue-700">
          Use Handlebars-style variables in your templates. For example,{" "}
          <code className="px-1 py-0.5 bg-blue-100 rounded">
            {"{{customer_name}}"}
          </code>{" "}
          will be replaced with the customer&apos;s name when the email is sent.
        </p>
      </div>
    </div>
  );
}
