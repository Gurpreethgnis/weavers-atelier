export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================
// LEGACY TYPES (from 0001_init.sql)
// ============================================

export type LeadType =
  | "general"
  | "shirt"
  | "trouser"
  | "denim"
  | "weddingwear"
  | "statement_piece"
  | "instagram_recreate"
  | "measurement_help"
  | "consultation";

export type LeadStatus =
  | "new"
  | "contacted"
  | "awaiting_customer"
  | "consultation_booked"
  | "quoted"
  | "converted"
  | "closed_lost"
  | "spam";

export type OrderStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "measurement_review"
  | "quote_needed"
  | "quote_sent"
  | "payment_pending"
  | "confirmed"
  | "in_production"
  | "ready_to_dispatch"
  | "dispatched"
  | "delivered"
  | "alteration_support"
  | "completed"
  | "cancelled";

export type ConsultationStatus =
  | "requested"
  | "scheduled"
  | "completed"
  | "no_show"
  | "converted"
  | "cancelled";

export type MeasurementMethod =
  | "body"
  | "garment"
  | "reference_upload"
  | "video_fitting";

export type MeasurementUnit = "inches" | "cm";

export type GarmentCategory =
  | "shirt"
  | "trouser"
  | "jeans"
  | "jacket"
  | "weddingwear"
  | "kurta"
  | "waistcoat"
  | "blazer";

export type FitPreference = "slim" | "regular" | "relaxed" | "oversized";

export type MeasurementConfidence =
  | "very_confident"
  | "somewhat_confident"
  | "please_review"
  | "video_fitting_requested";

export type ConsultationType =
  | "shirt_fit"
  | "trouser_fit"
  | "denim_design"
  | "weddingwear"
  | "statement_piece"
  | "instagram_look"
  | "video_measurement";

export type LookbookCategory =
  | "shirts"
  | "trousers"
  | "denim"
  | "weddingwear"
  | "kurtas"
  | "blazers"
  | "waistcoats"
  | "embroidery"
  | "statement_pieces";

// ============================================
// E-COMMERCE TYPES (from 0002_ecommerce_schema.sql)
// ============================================

export type ProductStatus = "draft" | "published" | "archived";

export type ProductCategory =
  | "shirt"
  | "trouser"
  | "denim"
  | "weddingwear"
  | "statement";

export type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "custom";

export type QuoteStatus =
  | "received"
  | "reviewing"
  | "quoted"
  | "accepted"
  | "invoiced"
  | "paid"
  | "declined"
  | "expired";

export type EcommerceOrderStatus =
  | "pending_payment"
  | "confirmed"
  | "in_production"
  | "quality_check"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";

export type OrderType = "rtw" | "custom";

export type AdminRole = "owner" | "admin" | "ops";

// ============================================
// DATABASE INTERFACE
// ============================================

export interface Database {
  public: {
    Tables: {
      // Legacy tables
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          source_page: string;
          lead_type: LeadType;
          name: string;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          country: string | null;
          city: string | null;
          preferred_contact_method: "email" | "phone" | "whatsapp" | null;
          garment_interest: string | null;
          need_by_date: string | null;
          budget_range: string | null;
          notes: string | null;
          status: LeadStatus;
          assigned_to: string | null;
          internal_notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["leads"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      custom_order_requests: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string | null;
          garment_type: string;
          category: GarmentCategory;
          selected_options: Json;
          measurement_method: MeasurementMethod | null;
          measurement_id: string | null;
          need_by_date: string | null;
          budget_range: string | null;
          status: OrderStatus;
          internal_notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["custom_order_requests"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["custom_order_requests"]["Insert"]
        >;
      };
      measurement_profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string | null;
          unit: MeasurementUnit;
          method: MeasurementMethod;
          garment_category: GarmentCategory;
          body_measurements: Json | null;
          garment_measurements: Json | null;
          height: string | null;
          weight: string | null;
          usual_size: string | null;
          fit_preference: FitPreference | null;
          confidence_level: MeasurementConfidence;
          notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["measurement_profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["measurement_profiles"]["Insert"]
        >;
      };
      consultation_requests: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string | null;
          consultation_type: ConsultationType;
          preferred_date: string | null;
          preferred_time: string | null;
          timezone: string | null;
          event_date: string | null;
          need_by_date: string | null;
          garment_type: string | null;
          budget_range: string | null;
          status: ConsultationStatus;
          notes: string | null;
          internal_notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["consultation_requests"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["consultation_requests"]["Insert"]
        >;
      };
      lookbook_items: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          category: LookbookCategory;
          tags: string[];
          image_url: string;
          video_url: string | null;
          instagram_url: string | null;
          description: string | null;
          cta_label: string | null;
          featured: boolean;
          sort_order: number;
          product_id: string | null;
          price_cents: number | null;
          sizes: SizeOption[] | null;
          rtw_available: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lookbook_items"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["lookbook_items"]["Insert"]
        >;
      };
      uploaded_references: {
        Row: {
          id: string;
          created_at: string;
          related_entity_type: "lead" | "order" | "measurement" | "consultation";
          related_entity_id: string;
          file_url: string;
          file_type: string;
          original_file_name: string;
          notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["uploaded_references"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["uploaded_references"]["Insert"]
        >;
      };

      // E-commerce tables
      collections: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          category: ProductCategory;
          name: string;
          description: string | null;
          hero_image_url: string | null;
          sort_order: number;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["collections"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["collections"]["Insert"]
        >;
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          collection_id: string | null;
          name: string;
          description: string | null;
          base_price_cents: number;
          currency: string;
          lead_time_days: number;
          custom_available: boolean;
          rtw_available: boolean;
          sizes: SizeOption[] | null;
          category: ProductCategory;
          status: ProductStatus;
          seo_title: string | null;
          seo_description: string | null;
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          created_at: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          is_primary: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["product_images"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_images"]["Insert"]
        >;
      };
      product_options: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          product_id: string;
          key: string;
          label: string;
          values: Json;
          shown_on: "rtw" | "custom" | "both";
          sort_order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["product_options"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_options"]["Insert"]
        >;
      };
      customers: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          auth_user_id: string | null;
          email: string;
          full_name: string;
          phone: string | null;
          default_shipping_address_id: string | null;
          default_billing_address_id: string | null;
          stripe_customer_id: string | null;
          marketing_consent: boolean;
          notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["customers"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_id: string;
          label: string | null;
          full_name: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string | null;
          postal_code: string;
          country: string;
          phone: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["addresses"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          order_number: string;
          customer_id: string | null;
          customer_email: string;
          order_type: OrderType;
          status: EcommerceOrderStatus;
          subtotal_cents: number;
          tax_cents: number;
          shipping_cents: number;
          total_cents: number;
          currency: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          stripe_invoice_id: string | null;
          shipping_address: Json | null;
          billing_address: Json | null;
          lead_time_days: number | null;
          estimated_ship_date: string | null;
          shipped_at: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          internal_notes: string | null;
          track_token: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at" | "order_number" | "track_token"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          order_number?: string;
          track_token?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          created_at: string;
          order_id: string;
          product_id: string | null;
          product_snapshot: Json;
          size: SizeOption;
          unit_price_cents: number;
          quantity: number;
          line_total_cents: number;
          custom_quote_id: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["order_items"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      custom_quotes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          product_id: string | null;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          requested_options: Json;
          measurement_profile_id: string | null;
          notes: string | null;
          reference_image_urls: string[];
          status: QuoteStatus;
          quoted_price_cents: number | null;
          quoted_lead_time_days: number | null;
          stripe_invoice_id: string | null;
          stripe_invoice_url: string | null;
          expires_at: string | null;
          internal_notes: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["custom_quotes"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["custom_quotes"]["Insert"]
        >;
      };
      email_templates: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          key: string;
          name: string;
          subject: string;
          html_body: string;
          text_body: string | null;
          variables: Json;
        };
        Insert: Omit<
          Database["public"]["Tables"]["email_templates"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["email_templates"]["Insert"]
        >;
      };
      admin_users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          auth_user_id: string;
          email: string;
          role: AdminRole;
          active: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["admin_users"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["admin_users"]["Insert"]
        >;
      };
      settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          key: string;
          value: Json;
          description: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["settings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      lead_type: LeadType;
      lead_status: LeadStatus;
      order_status: OrderStatus;
      consultation_status: ConsultationStatus;
      measurement_method: MeasurementMethod;
      measurement_unit: MeasurementUnit;
      garment_category: GarmentCategory;
      fit_preference: FitPreference;
      measurement_confidence: MeasurementConfidence;
      consultation_type: ConsultationType;
      lookbook_category: LookbookCategory;
      product_status: ProductStatus;
      product_category: ProductCategory;
      size_option: SizeOption;
      quote_status: QuoteStatus;
      ecommerce_order_status: EcommerceOrderStatus;
      order_type: OrderType;
      admin_role: AdminRole;
    };
  };
}

// ============================================
// CONVENIENCE TYPE EXPORTS
// ============================================

export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
export type CollectionUpdate = Database["public"]["Tables"]["collections"]["Update"];

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductImageInsert = Database["public"]["Tables"]["product_images"]["Insert"];

export type ProductOption = Database["public"]["Tables"]["product_options"]["Row"];
export type ProductOptionInsert = Database["public"]["Tables"]["product_options"]["Insert"];

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];

export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];

export type CustomQuote = Database["public"]["Tables"]["custom_quotes"]["Row"];
export type CustomQuoteInsert = Database["public"]["Tables"]["custom_quotes"]["Insert"];
export type CustomQuoteUpdate = Database["public"]["Tables"]["custom_quotes"]["Update"];

export type EmailTemplate = Database["public"]["Tables"]["email_templates"]["Row"];
export type EmailTemplateInsert = Database["public"]["Tables"]["email_templates"]["Insert"];
export type EmailTemplateUpdate = Database["public"]["Tables"]["email_templates"]["Update"];

export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];
export type AdminUserInsert = Database["public"]["Tables"]["admin_users"]["Insert"];

export type Setting = Database["public"]["Tables"]["settings"]["Row"];
export type SettingInsert = Database["public"]["Tables"]["settings"]["Insert"];

// Product with relations
export type ProductWithImages = Product & {
  product_images: ProductImage[];
};

export type ProductWithDetails = Product & {
  product_images: ProductImage[];
  product_options: ProductOption[];
  collections: Collection | null;
};

// Order with items
export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

// Address for shipping/billing
export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone?: string;
}
