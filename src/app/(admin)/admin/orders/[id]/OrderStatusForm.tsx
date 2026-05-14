"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, AlertTriangle } from "lucide-react";
import { updateOrderStatus, refundOrder } from "@/lib/actions/admin";
import type { EcommerceOrderStatus } from "@/lib/supabase/types";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: EcommerceOrderStatus;
  trackingNumber: string;
  trackingUrl: string;
  internalNotes: string;
  hasPaymentIntent: boolean;
}

const STATUS_OPTIONS: { value: EcommerceOrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_production", label: "In Production" },
  { value: "quality_check", label: "Quality Check" },
  { value: "ready_to_ship", label: "Ready to Ship" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export function OrderStatusForm({
  orderId,
  currentStatus,
  trackingNumber: initialTrackingNumber,
  trackingUrl: initialTrackingUrl,
  internalNotes: initialInternalNotes,
  hasPaymentIntent,
}: OrderStatusFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const [status, setStatus] = useState<EcommerceOrderStatus>(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);
  const [internalNotes, setInternalNotes] = useState(initialInternalNotes);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateOrderStatus(orderId, status, {
        tracking_number: trackingNumber || undefined,
        tracking_url: trackingUrl || undefined,
        internal_notes: internalNotes || undefined,
      });

      if (result.success) {
        toast.success("Order updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async () => {
    if (
      !confirm(
        "Are you sure you want to refund this order? This will refund the full amount to the customer."
      )
    ) {
      return;
    }

    setRefunding(true);
    try {
      const result = await refundOrder(orderId);

      if (result.success) {
        toast.success("Order refunded");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to refund order");
      }
    } catch (error) {
      console.error("Refund error:", error);
      toast.error("Failed to refund order");
    } finally {
      setRefunding(false);
    }
  };

  const isTerminalStatus = ["cancelled", "refunded", "completed"].includes(
    currentStatus
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as EcommerceOrderStatus)}
          disabled={isTerminalStatus}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {(status === "shipped" || trackingUrl) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={isTerminalStatus}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="1Z999AA10123456784"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking URL
            </label>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              disabled={isTerminalStatus}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="https://www.ups.com/track?tracknum=..."
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Internal Notes
        </label>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notes visible only to admins..."
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          {hasPaymentIntent &&
            !["refunded", "cancelled", "pending_payment"].includes(
              currentStatus
            ) && (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {refunding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                Refund Order
              </button>
            )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || isTerminalStatus}
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
