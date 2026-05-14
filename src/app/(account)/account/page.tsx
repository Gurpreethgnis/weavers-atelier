import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Ruler,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?redirect=/account");
  }

  // Get customer data
  const { data: customer } = await supabase
    .from("customers")
    .select("id, full_name, email, phone")
    .eq("email", user.email)
    .single();

  // Get recent orders count
  const { count: ordersCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("customer_email", user.email);

  // Get addresses count
  const { count: addressesCount } = customer
    ? await supabase
        .from("addresses")
        .select("id", { count: "exact", head: true })
        .eq("customer_id", customer.id)
    : { count: 0 };

  // Get measurement profiles count
  const { count: measurementsCount } = await supabase
    .from("measurement_profiles")
    .select("id", { count: "exact", head: true })
    .eq("email", user.email);

  const accountSections = [
    {
      title: "Orders",
      description: `${ordersCount || 0} order${ordersCount !== 1 ? "s" : ""}`,
      href: "/account/orders",
      icon: Package,
    },
    {
      title: "Measurements",
      description: `${measurementsCount || 0} saved profile${measurementsCount !== 1 ? "s" : ""}`,
      href: "/account/measurements",
      icon: Ruler,
    },
    {
      title: "Addresses",
      description: `${addressesCount || 0} saved address${addressesCount !== 1 ? "es" : ""}`,
      href: "/account/addresses",
      icon: MapPin,
    },
  ];

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-semibold mb-2">My Account</h1>
          <p className="text-on-surface-variant">
            Welcome back{customer?.full_name ? `, ${customer.full_name}` : ""}
          </p>
        </div>

        {/* Profile Summary */}
        <div className="bg-surface-container p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="font-medium">{customer?.full_name || user.email}</h2>
              <p className="text-sm text-on-surface-variant">{user.email}</p>
              {customer?.phone && (
                <p className="text-sm text-on-surface-variant mt-1">{customer.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="space-y-2">
          {accountSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-center gap-4 p-4 bg-surface border border-outline-variant hover:border-outline transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                <section.icon className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-on-surface-variant">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <form action="/api/auth/signout" method="POST" className="mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
