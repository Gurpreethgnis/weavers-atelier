import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Ruler, MapPin } from "lucide-react";
import type { EcommerceOrderStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface CustomerOrder {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  total_cents: number | null;
  currency: string;
  created_at: string;
}

interface CustomerAddress {
  id: string;
  label: string | null;
  full_name: string | null;
  line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select(
      `
      *,
      addresses (
        id,
        label,
        full_name,
        line1,
        city,
        state,
        postal_code,
        country
      ),
      orders (
        id,
        order_number,
        order_type,
        status,
        total_cents,
        currency,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !customer) {
    notFound();
  }

  // Get measurement profiles by email
  const { data: measurements } = await supabase
    .from("measurement_profiles")
    .select("id, garment_category, fit_preference, created_at")
    .eq("email", customer.email);

  const formatCurrency = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: EcommerceOrderStatus) => {
    const colors: Record<string, string> = {
      confirmed: "bg-blue-100 text-blue-700",
      in_production: "bg-purple-100 text-purple-700",
      shipped: "bg-green-100 text-green-700",
      delivered: "bg-green-100 text-green-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      refunded: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  // Calculate stats
  const orders = (customer.orders || []) as CustomerOrder[];
  const addresses = (customer.addresses || []) as CustomerAddress[];
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.total_cents || 0),
    0
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.full_name}
            </h1>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              customer.auth_user_id
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {customer.auth_user_id ? "Registered" : "Guest"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatDate(customer.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.length === 0 && (
                <p className="p-4 text-gray-500 text-sm">No orders yet</p>
              )}
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="p-4 hover:bg-gray-50 block"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        #{order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(order.total_cents || 0, order.currency)}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          order.status as EcommerceOrderStatus
                        )}`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{customer.email}</dd>
              </div>
              {customer.phone && (
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{customer.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Marketing</dt>
                <dd className="text-gray-900">
                  {customer.marketing_consent ? "Opted in" : "Opted out"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Addresses</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {addresses.length === 0 && (
                <p className="p-4 text-gray-500 text-sm">No saved addresses</p>
              )}
              {addresses.map((address) => (
                <div key={address.id} className="p-4 text-sm">
                  {address.label && (
                    <p className="font-medium text-gray-900 mb-1">
                      {address.label}
                    </p>
                  )}
                  <p className="text-gray-700">{address.full_name}</p>
                  <p className="text-gray-700">{address.line1}</p>
                  <p className="text-gray-700">
                    {address.city}
                    {address.state && `, ${address.state}`} {address.postal_code}
                  </p>
                  <p className="text-gray-700">{address.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Measurements</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {(!measurements || measurements.length === 0) && (
                <p className="p-4 text-gray-500 text-sm">No measurement profiles</p>
              )}
              {measurements?.map((profile) => (
                <div key={profile.id} className="p-4">
                  <p className="font-medium text-gray-900 capitalize">
                    {profile.garment_category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile.fit_preference && `${profile.fit_preference} fit`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {customer.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
