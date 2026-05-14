type AnalyticsEvent =
  | "hero_cta_click"
  | "category_card_click"
  | "start_custom_order"
  | "start_denim_design"
  | "book_consultation_click"
  | "whatsapp_click"
  | "lookbook_filter_click"
  | "recreate_look_click"
  | "reference_upload_started"
  | "reference_upload_completed"
  | "measurement_flow_started"
  | "measurement_submitted"
  | "consultation_form_submitted"
  | "custom_order_form_submitted"
  | "delivery_page_view"
  | "returns_page_view";

interface EventProperties {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  // Vercel Analytics
  if (typeof window.va === "function") {
    window.va("event", { name: event, ...properties });
  }

  // Console logging for development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", event, properties);
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;

  if (typeof window.va === "function") {
    window.va("pageview", { path });
  }
}

declare global {
  interface Window {
    va?: (event: string, properties?: Record<string, unknown>) => void;
  }
}
