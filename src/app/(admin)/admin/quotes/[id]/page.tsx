import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  ExternalLink,
  Image as ImageIcon,
  Ruler,
} from "lucide-react";
import { QuoteStatusForm } from "./QuoteStatusForm";
import type { QuoteStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quote, error } = await supabase
    .from("custom_quotes")
    .select(
      `
      *,
      products (
        id,
        name,
        slug,
        category,
        base_price_usd
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !quote) {
    notFound();
  }

  // Get measurement profile if linked
  let measurementProfile = null;
  if (quote.measurement_profile_id) {
    const { data } = await supabase
      .from("measurement_profiles")
      .select("*")
      .eq("id", quote.measurement_profile_id)
      .single();
    measurementProfile = data;
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: QuoteStatus) => {
    switch (status) {
      case "received":
      case "reviewing":
        return <Clock className="w-5 h-5" />;
      case "quoted":
      case "accepted":
      case "invoiced":
        return <DollarSign className="w-5 h-5" />;
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "declined":
      case "expired":
        return <XCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: QuoteStatus) => {
    const colors: Record<QuoteStatus, string> = {
      received: "bg-gray-100 text-gray-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      quoted: "bg-blue-100 text-blue-700",
      accepted: "bg-cyan-100 text-cyan-700",
      invoiced: "bg-purple-100 text-purple-700",
      paid: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-500",
    };
    return colors[status];
  };

  const statusTimeline: QuoteStatus[] = [
    "received",
    "reviewing",
    "quoted",
    "invoiced",
    "paid",
  ];
  const currentStatusIndex = statusTimeline.indexOf(quote.status as QuoteStatus);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quotes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quote from {quote.customer_name}
            </h1>
            <p className="text-sm text-gray-500">
              Received {formatDate(quote.created_at)}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getStatusColor(
              quote.status as QuoteStatus
            )}`}
          >
            {getStatusIcon(quote.status as QuoteStatus)}
            {quote.status}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Progress</h2>
        <div className="flex items-center justify-between">
          {statusTimeline.map((s, i) => {
            const isActive = i <= currentStatusIndex;
            const isCurrent = s === quote.status;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    } ${isCurrent ? "ring-2 ring-blue-300" : ""}`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs capitalize ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < statusTimeline.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      i < currentStatusIndex ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product</h2>
            {quote.products ? (
              <Link
                href={`/admin/products/${quote.products.id}`}
                className="flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {quote.products.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {quote.products.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Base Price</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(quote.products.base_price_usd * 100)}
                  </p>
                </div>
              </Link>
            ) : (
              <p className="text-gray-500">Product not specified</p>
            )}
          </div>

          {/* Requested Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customization Options
            </h2>
            {quote.requested_options &&
            Object.keys(quote.requested_options).length > 0 ? (
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(quote.requested_options as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {String(value)}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            ) : (
              <p className="text-gray-500">No specific options requested</p>
            )}
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Notes
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {/* Reference Images */}
          {quote.reference_image_urls && quote.reference_image_urls.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Reference Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(quote.reference_image_urls as string[]).map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`Reference ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Measurement Profile */}
          {measurementProfile && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gray-400" />
                Measurements
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {measurementProfile.measurements &&
                  Object.entries(measurementProfile.measurements as Record<string, number | string>).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt className="text-sm text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {value}{" "}
                          {measurementProfile.measurement_unit || ""}
                        </dd>
                      </div>
                    )
                  )}
              </dl>
              {measurementProfile.fit_preference && (
                <p className="mt-4 text-sm text-gray-500">
                  Fit preference:{" "}
                  <span className="font-medium text-gray-900">
                    {measurementProfile.fit_preference}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="text-gray-900">{quote.customer_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{quote.customer_email}</dd>
              </div>
              {quote.customer_phone && (
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{quote.customer_phone}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quote Details */}
          {(quote.quoted_price_cents || quote.quoted_lead_time_days) && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quote Details</h3>
              <dl className="space-y-2 text-sm">
                {quote.quoted_price_cents && (
                  <div>
                    <dt className="text-gray-500">Quoted Price</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {formatCurrency(quote.quoted_price_cents)}
                    </dd>
                  </div>
                )}
                {quote.quoted_lead_time_days && (
                  <div>
                    <dt className="text-gray-500">Lead Time</dt>
                    <dd className="text-gray-900">
                      {quote.quoted_lead_time_days} days
                    </dd>
                  </div>
                )}
                {quote.expires_at && (
                  <div>
                    <dt className="text-gray-500">Quote Expires</dt>
                    <dd className="text-gray-900">
                      {formatDate(quote.expires_at)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Stripe Invoice */}
          {quote.stripe_invoice_url && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Invoice</h3>
              <a
                href={quote.stripe_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
                View Stripe Invoice
              </a>
            </div>
          )}

          {/* Status Form */}
          <QuoteStatusForm
            quoteId={quote.id}
            currentStatus={quote.status as QuoteStatus}
            quotedPriceCents={quote.quoted_price_cents}
            quotedLeadTimeDays={quote.quoted_lead_time_days}
            internalNotes={quote.internal_notes}
            customerEmail={quote.customer_email}
            customerName={quote.customer_name}
            productName={quote.products?.name}
            stripeInvoiceId={quote.stripe_invoice_id}
          />
        </div>
      </div>
    </div>
  );
}
