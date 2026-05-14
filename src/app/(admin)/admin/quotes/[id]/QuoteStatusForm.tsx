"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Save,
  FileText,
} from "lucide-react";
import {
  updateQuoteStatus,
  createStripeInvoiceForQuote,
} from "@/lib/actions/admin";
import type { QuoteStatus } from "@/lib/supabase/types";

interface QuoteStatusFormProps {
  quoteId: string;
  currentStatus: QuoteStatus;
  quotedPriceCents: number | null;
  quotedLeadTimeDays: number | null;
  internalNotes: string | null;
  customerEmail: string;
  customerName: string;
  productName?: string;
  stripeInvoiceId: string | null;
}

export function QuoteStatusForm({
  quoteId,
  currentStatus,
  quotedPriceCents,
  quotedLeadTimeDays,
  internalNotes,
  customerEmail,
  customerName,
  productName,
  stripeInvoiceId,
}: QuoteStatusFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [status, setStatus] = useState<QuoteStatus>(currentStatus);
  const [price, setPrice] = useState(
    quotedPriceCents ? (quotedPriceCents / 100).toFixed(2) : ""
  );
  const [leadTime, setLeadTime] = useState(
    quotedLeadTimeDays?.toString() || ""
  );
  const [notes, setNotes] = useState(internalNotes || "");

  const statuses: QuoteStatus[] = [
    "received",
    "reviewing",
    "quoted",
    "accepted",
    "invoiced",
    "paid",
    "declined",
    "expired",
  ];

  const canSendInvoice =
    status === "quoted" &&
    price &&
    parseFloat(price) > 0 &&
    !stripeInvoiceId;

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateQuoteStatus(quoteId, {
        status,
        quoted_price_cents: price ? Math.round(parseFloat(price) * 100) : null,
        quoted_lead_time_days: leadTime ? parseInt(leadTime) : null,
        internal_notes: notes || null,
      });

      if (result.success) {
        toast.success("Quote updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update quote");
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      toast.error("Failed to update quote");
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid price before sending invoice");
      return;
    }

    if (
      !confirm(
        `Send a $${price} invoice to ${customerName} (${customerEmail})?`
      )
    ) {
      return;
    }

    setSendingInvoice(true);
    try {
      const result = await createStripeInvoiceForQuote(quoteId, {
        customer_email: customerEmail,
        customer_name: customerName,
        amount_cents: Math.round(parseFloat(price) * 100),
        description: productName
          ? `Custom ${productName}`
          : "Custom Order Quote",
        lead_time_days: leadTime ? parseInt(leadTime) : undefined,
      });

      if (result.success) {
        toast.success("Invoice sent successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    } finally {
      setSendingInvoice(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Manage Quote</h3>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as QuoteStatus)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={currentStatus === "paid"}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Quoted Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quoted Price (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              disabled={currentStatus === "paid" || !!stripeInvoiceId}
            />
          </div>
        </div>

        {/* Lead Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Time (Days)
          </label>
          <input
            type="number"
            min="1"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 14"
            disabled={currentStatus === "paid"}
          />
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internal Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Notes for internal use only..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || currentStatus === "paid"}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
          {canSendInvoice && (
            <button
              onClick={handleSendInvoice}
              disabled={sendingInvoice}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sendingInvoice ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Invoice
            </button>
          )}
        </div>

        {stripeInvoiceId && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Invoice already sent
          </p>
        )}
      </div>
    </div>
  );
}
