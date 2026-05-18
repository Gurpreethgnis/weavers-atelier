"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2, Edit, Star, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Address as AddressType } from "@/lib/supabase/types";

interface AddressWithDefault extends AddressType {
  is_default?: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressWithDefault[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    label: "",
    full_name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    phone: "",
    is_default: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/account/login?redirect=/account/addresses");
      return;
    }

    // Get customer with default address info
    const { data: customerData } = await supabase
      .from("customers")
      .select("id, default_shipping_address_id")
      .eq("email", user.email || "")
      .single() as { data: { id: string; default_shipping_address_id: string | null } | null };

    if (!customerData) {
      setLoading(false);
      return;
    }

    const customerId = customerData.id;
    const defaultShippingId = customerData.default_shipping_address_id;

    setDefaultAddressId(defaultShippingId);

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }) as { data: AddressType[] | null };

    // Add is_default flag based on customer's default_shipping_address_id
    const addressesWithDefault: AddressWithDefault[] = (data || []).map(addr => ({
      ...addr,
      is_default: addr.id === defaultShippingId,
    }));

    // Sort to put default first
    addressesWithDefault.sort((a, b) => {
      if (a.is_default && !b.is_default) return -1;
      if (!a.is_default && b.is_default) return 1;
      return 0;
    });

    setAddresses(addressesWithDefault);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // Get or create customer
      let customerData: { id: string } | null = null;
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", user.email || "")
        .single() as { data: { id: string } | null };

      if (!existingCustomer) {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert({
            email: user.email || "",
            full_name: formData.full_name,
            auth_user_id: user.id,
          } as never)
          .select("id")
          .single() as { data: { id: string } | null; error: Error | null };

        if (createError) throw createError;
        customerData = newCustomer;
      } else {
        customerData = existingCustomer;
      }

      if (!customerData) throw new Error("Failed to get or create customer");

      let newAddressId = editingId;

      if (editingId) {
        // Update existing address
        const { error } = await supabase
          .from("addresses")
          .update({
            label: formData.label || null,
            full_name: formData.full_name,
            line1: formData.line1,
            line2: formData.line2 || null,
            city: formData.city,
            state: formData.state || null,
            postal_code: formData.postal_code,
            country: formData.country,
            phone: formData.phone || null,
          } as never)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Address updated");
      } else {
        // Create new address
        const { data: newAddress, error } = await supabase
          .from("addresses")
          .insert({
            customer_id: customerData.id,
            label: formData.label || null,
            full_name: formData.full_name,
            line1: formData.line1,
            line2: formData.line2 || null,
            city: formData.city,
            state: formData.state || null,
            postal_code: formData.postal_code,
            country: formData.country,
            phone: formData.phone || null,
          } as never)
          .select("id")
          .single() as { data: { id: string } | null; error: Error | null };

        if (error) throw error;
        newAddressId = newAddress?.id || null;
        toast.success("Address added");
      }

      // If setting as default, update customer's default_shipping_address_id
      if (formData.is_default && newAddressId) {
        await supabase
          .from("customers")
          .update({ default_shipping_address_id: newAddressId } as never)
          .eq("id", customerData.id);
      }

      // Reset form and reload
      setFormData({
        label: "",
        full_name: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
        phone: "",
        is_default: false,
      });
      setShowForm(false);
      setEditingId(null);
      loadAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;

    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);

      if (error) throw error;
      toast.success("Address deleted");
      loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: customerForDefault } = await supabase
        .from("customers")
        .select("id")
        .eq("email", user.email || "")
        .single() as { data: { id: string } | null };

      if (!customerForDefault) throw new Error("Customer not found");

      // Update customer's default shipping address
      const { error } = await supabase
        .from("customers")
        .update({ default_shipping_address_id: id } as never)
        .eq("id", customerForDefault.id);

      if (error) throw error;
      setDefaultAddressId(id);
      toast.success("Default address updated");
      loadAddresses();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to update default address");
    }
  }

  function handleEdit(address: AddressWithDefault) {
    setFormData({
      label: address.label || "",
      full_name: address.full_name,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || "",
      is_default: address.is_default || false,
    });
    setEditingId(address.id);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="container-atelier py-8 md:py-12">
        <div className="max-w-3xl mx-auto flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-on-surface-variant" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-heading font-semibold mb-2">
                Saved Addresses
              </h1>
              <p className="text-on-surface-variant">
                Manage your shipping and billing addresses
              </p>
            </div>
            {!showForm && (
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    label: "",
                    full_name: "",
                    line1: "",
                    line2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "US",
                    phone: "",
                    is_default: addresses.length === 0,
                  });
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </Button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-surface border border-outline-variant p-6 mb-8">
            <h2 className="font-medium mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Work"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address"
                  value={formData.line1}
                  onChange={(e) =>
                    setFormData({ ...formData, line1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Line 2 (optional)
                </label>
                <input
                  type="text"
                  placeholder="Apt, suite, unit, etc."
                  value={formData.line2}
                  onChange={(e) =>
                    setFormData({ ...formData, line2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData({ ...formData, postal_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="SG">Singapore</option>
                    <option value="AE">United Arab Emirates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Set as default shipping address</span>
              </label>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Address"
                  ) : (
                    "Add Address"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-12 bg-surface-container">
            <MapPin className="w-12 h-12 mx-auto text-on-surface-variant mb-4" />
            <h2 className="text-lg font-medium mb-2">No addresses saved</h2>
            <p className="text-on-surface-variant mb-6">
              Add an address to speed up checkout
            </p>
            <Button
              onClick={() => {
                setFormData({
                  ...formData,
                  is_default: true,
                });
                setShowForm(true);
              }}
            >
              Add Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-surface border border-outline-variant p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {address.label && (
                      <span className="text-sm font-medium">{address.label}</span>
                    )}
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded">
                        <Star className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-on-surface-variant hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium">{address.full_name}</p>
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}
                    {address.state ? `, ${address.state}` : ""} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && (
                    <p className="text-on-surface-variant mt-1">{address.phone}</p>
                  )}
                </div>

                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm text-secondary hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
