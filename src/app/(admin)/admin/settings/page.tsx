"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Clock, Truck, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { updateSettings } from "@/lib/actions/admin";

interface Settings {
  // Lead times
  shirt_lead_time_days: number;
  trouser_lead_time_days: number;
  denim_lead_time_days: number;
  custom_lead_time_days: number;
  weddingwear_lead_time_days: number;
  // Shipping
  domestic_shipping_usd: number;
  international_shipping_usd: number;
  free_shipping_threshold_usd: number;
  // Contact
  support_email: string;
  support_phone: string;
  whatsapp_number: string;
  // Social
  instagram_url: string;
  // Operations
  order_number_prefix: string;
}

const defaultSettings: Settings = {
  shirt_lead_time_days: 14,
  trouser_lead_time_days: 14,
  denim_lead_time_days: 21,
  custom_lead_time_days: 21,
  weddingwear_lead_time_days: 45,
  domestic_shipping_usd: 12,
  international_shipping_usd: 35,
  free_shipping_threshold_usd: 250,
  support_email: "hello@weaversatelier.com",
  support_phone: "",
  whatsapp_number: "",
  instagram_url: "",
  order_number_prefix: "WA",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      // Load settings from various keys and merge
      const { data } = await supabase.from("settings").select("key, value");

      if (data) {
        const merged = { ...defaultSettings };
        const rows = data as Array<{ key: string; value: unknown }>;
        for (const row of rows) {
          const val = row.value as Record<string, unknown>;
          switch (row.key) {
            case "lead_time_rtw_shirt":
              merged.shirt_lead_time_days = (val.days as number) || 14;
              break;
            case "lead_time_rtw_trouser":
              merged.trouser_lead_time_days = (val.days as number) || 14;
              break;
            case "lead_time_rtw_denim":
              merged.denim_lead_time_days = (val.days as number) || 21;
              break;
            case "lead_time_custom_shirt":
              merged.custom_lead_time_days = (val.days as number) || 21;
              break;
            case "lead_time_weddingwear":
              merged.weddingwear_lead_time_days = (val.days as number) || 45;
              break;
            case "shipping_domestic_days":
              merged.domestic_shipping_usd = ((val.rate_cents as number) || 0) / 100;
              break;
            case "shipping_international_days":
              merged.international_shipping_usd = ((val.rate_cents as number) || 2500) / 100;
              break;
            case "free_shipping_threshold":
              merged.free_shipping_threshold_usd = (val.cents as number) / 100 || 250;
              break;
            case "contact_email":
              merged.support_email = (val as unknown as string) || defaultSettings.support_email;
              break;
            case "contact_phone":
              merged.support_phone = (val as unknown as string) || "";
              break;
            case "whatsapp_number":
              merged.whatsapp_number = (val as unknown as string) || "";
              break;
            case "instagram_url":
              merged.instagram_url = (val as unknown as string) || "";
              break;
            case "order_number_prefix":
              merged.order_number_prefix = (val as unknown as string) || "WA";
              break;
            case "site_settings":
              // Bulk settings object
              Object.assign(merged, val);
              break;
          }
        }
        setSettings(merged);
      }
      setLoading(false);
    }
    loadSettings();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings(settings as unknown as Record<string, unknown>);

      if (result.success) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
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
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* Lead Times */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              Production Lead Times
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Default production time in days for each category
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shirts
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={settings.shirt_lead_time_days}
                  onChange={(e) =>
                    updateSetting("shirt_lead_time_days", parseInt(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trousers
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={settings.trouser_lead_time_days}
                  onChange={(e) =>
                    updateSetting("trouser_lead_time_days", parseInt(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Denim
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={settings.denim_lead_time_days}
                  onChange={(e) =>
                    updateSetting("denim_lead_time_days", parseInt(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Orders
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={settings.custom_lead_time_days}
                  onChange={(e) =>
                    updateSetting("custom_lead_time_days", parseInt(e.target.value) || 0)
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weddingwear
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={settings.weddingwear_lead_time_days}
                  onChange={(e) =>
                    updateSetting(
                      "weddingwear_lead_time_days",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Shipping</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domestic Shipping
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.domestic_shipping_usd}
                  onChange={(e) =>
                    updateSetting(
                      "domestic_shipping_usd",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">USD</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                International Shipping
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.international_shipping_usd}
                  onChange={(e) =>
                    updateSetting(
                      "international_shipping_usd",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">USD</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.free_shipping_threshold_usd}
                  onChange={(e) =>
                    updateSetting(
                      "free_shipping_threshold_usd",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">USD</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Set to 0 to disable free shipping
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => updateSetting("support_email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="support@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Phone
              </label>
              <input
                type="tel"
                value={settings.support_phone}
                onChange={(e) => updateSetting("support_phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={settings.whatsapp_number}
                onChange={(e) => updateSetting("whatsapp_number", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+15551234567"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code, no spaces
              </p>
            </div>
          </div>
        </div>

        {/* Social & Branding */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              Social & Branding
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => updateSetting("instagram_url", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/weaversatelier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number Prefix
              </label>
              <input
                type="text"
                value={settings.order_number_prefix}
                onChange={(e) =>
                  updateSetting("order_number_prefix", e.target.value.toUpperCase())
                }
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="WA"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Orders will be numbered like {settings.order_number_prefix}-20260514-001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
