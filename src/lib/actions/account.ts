"use server";

import { createServiceClient } from "@/lib/supabase/server";

export interface LinkOrdersResult {
  success: boolean;
  linkedCount: number;
  error?: string;
}

/**
 * Links existing guest orders to a newly authenticated user account.
 * Called after a user creates an account or logs in to associate
 * their previous guest orders with their account.
 */
export async function linkGuestOrdersToAccount(
  email: string
): Promise<LinkOrdersResult> {
  try {
    const supabase = await createServiceClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, linkedCount: 0, error: "Not authenticated" };
    }

    // Ensure email matches
    if (user.email?.toLowerCase() !== email.toLowerCase()) {
      return { success: false, linkedCount: 0, error: "Email mismatch" };
    }

    // Get or create customer record
    let { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (!customer) {
      const { data: newCustomer, error: createError } = await supabase
        .from("customers")
        .insert({
          email: email.toLowerCase(),
          user_id: user.id,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Error creating customer:", createError);
        return { success: false, linkedCount: 0, error: "Failed to create customer" };
      }
      customer = newCustomer;
    } else {
      // Update existing customer with user_id if not set
      await supabase
        .from("customers")
        .update({ user_id: user.id })
        .eq("id", customer.id)
        .is("user_id", null);
    }

    // Link orders that have this email but no customer_id
    const { data: orders, error: updateError } = await supabase
      .from("orders")
      .update({ customer_id: customer.id })
      .eq("customer_email", email.toLowerCase())
      .is("customer_id", null)
      .select("id");

    if (updateError) {
      console.error("Error linking orders:", updateError);
      return { success: false, linkedCount: 0, error: "Failed to link orders" };
    }

    // Also link custom quotes
    await supabase
      .from("custom_quotes")
      .update({ customer_id: customer.id })
      .eq("customer_email", email.toLowerCase())
      .is("customer_id", null);

    // Link measurement profiles
    await supabase
      .from("measurement_profiles")
      .update({ customer_id: customer.id })
      .eq("email", email.toLowerCase())
      .is("customer_id", null);

    return {
      success: true,
      linkedCount: orders?.length || 0,
    };
  } catch (error) {
    console.error("Error in linkGuestOrdersToAccount:", error);
    return {
      success: false,
      linkedCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Updates customer profile information.
 */
export async function updateCustomerProfile(data: {
  full_name?: string;
  phone?: string;
  marketing_consent?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("customers")
      .upsert(
        {
          email: user.email,
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
        }
      );

    if (error) {
      console.error("Error updating customer profile:", error);
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateCustomerProfile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deletes a measurement profile.
 */
export async function deleteMeasurementProfile(
  profileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify the profile belongs to the user
    const { data: profile } = await supabase
      .from("measurement_profiles")
      .select("id, email")
      .eq("id", profileId)
      .single();

    if (!profile || profile.email?.toLowerCase() !== user.email.toLowerCase()) {
      return { success: false, error: "Profile not found or access denied" };
    }

    const { error } = await supabase
      .from("measurement_profiles")
      .delete()
      .eq("id", profileId);

    if (error) {
      console.error("Error deleting measurement profile:", error);
      return { success: false, error: "Failed to delete profile" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteMeasurementProfile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
