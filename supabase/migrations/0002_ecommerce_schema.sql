-- Weavers Atelier E-commerce Schema Migration
-- Phase 1: Foundation for storefront repositioning

-- ============================================
-- NEW ENUM TYPES
-- ============================================

CREATE TYPE product_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE product_category AS ENUM (
  'shirt',
  'trouser',
  'denim',
  'weddingwear',
  'statement'
);

CREATE TYPE size_option AS ENUM (
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'custom'
);

CREATE TYPE quote_status AS ENUM (
  'received',
  'reviewing',
  'quoted',
  'accepted',
  'invoiced',
  'paid',
  'declined',
  'expired'
);

CREATE TYPE ecommerce_order_status AS ENUM (
  'pending_payment',
  'confirmed',
  'in_production',
  'quality_check',
  'ready_to_ship',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunded'
);

CREATE TYPE order_type AS ENUM (
  'rtw',
  'custom'
);

CREATE TYPE admin_role AS ENUM (
  'owner',
  'admin',
  'ops'
);

-- ============================================
-- COLLECTIONS TABLE
-- ============================================

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug TEXT NOT NULL UNIQUE,
  category product_category NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hero_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT
);

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_category ON collections(category);
CREATE INDEX idx_collections_published ON collections(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_collections_sort ON collections(sort_order);

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug TEXT NOT NULL UNIQUE,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  lead_time_days INTEGER NOT NULL DEFAULT 14,
  custom_available BOOLEAN NOT NULL DEFAULT true,
  rtw_available BOOLEAN NOT NULL DEFAULT true,
  sizes size_option[] DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL']::size_option[],
  category product_category NOT NULL,
  status product_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_published ON products(status) WHERE status = 'published';
CREATE INDEX idx_products_sort ON products(sort_order);

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id) WHERE is_primary = true;
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);

-- ============================================
-- PRODUCT OPTIONS TABLE
-- ============================================

CREATE TABLE product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  values JSONB NOT NULL DEFAULT '[]',
  shown_on TEXT NOT NULL DEFAULT 'both' CHECK (shown_on IN ('rtw', 'custom', 'both')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, key)
);

CREATE INDEX idx_product_options_product ON product_options(product_id);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  default_shipping_address_id UUID,
  default_billing_address_id UUID,
  stripe_customer_id TEXT UNIQUE,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT
);

CREATE UNIQUE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_auth_user ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX idx_customers_stripe ON customers(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- ============================================
-- ADDRESSES TABLE
-- ============================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- Add FK constraints for customer default addresses
ALTER TABLE customers
  ADD CONSTRAINT fk_default_shipping_address
  FOREIGN KEY (default_shipping_address_id)
  REFERENCES addresses(id)
  ON DELETE SET NULL;

ALTER TABLE customers
  ADD CONSTRAINT fk_default_billing_address
  FOREIGN KEY (default_billing_address_id)
  REFERENCES addresses(id)
  ON DELETE SET NULL;

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  order_type order_type NOT NULL,
  status ecommerce_order_status NOT NULL DEFAULT 'pending_payment',
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  lead_time_days INTEGER,
  estimated_ship_date DATE,
  shipped_at TIMESTAMPTZ,
  tracking_number TEXT,
  tracking_url TEXT,
  internal_notes TEXT,
  track_token UUID NOT NULL DEFAULT uuid_generate_v4()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(order_type);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX idx_orders_stripe_invoice ON orders(stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;
CREATE INDEX idx_orders_track_token ON orders(track_token);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_snapshot JSONB NOT NULL,
  size size_option NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total_cents INTEGER NOT NULL,
  custom_quote_id UUID
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_quote ON order_items(custom_quote_id) WHERE custom_quote_id IS NOT NULL;

-- ============================================
-- CUSTOM QUOTES TABLE
-- ============================================

CREATE TABLE custom_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  requested_options JSONB NOT NULL DEFAULT '{}',
  measurement_profile_id UUID REFERENCES measurement_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  reference_image_urls TEXT[] DEFAULT '{}',
  status quote_status NOT NULL DEFAULT 'received',
  quoted_price_cents INTEGER,
  quoted_lead_time_days INTEGER,
  stripe_invoice_id TEXT,
  stripe_invoice_url TEXT,
  expires_at TIMESTAMPTZ,
  internal_notes TEXT
);

CREATE INDEX idx_custom_quotes_product ON custom_quotes(product_id);
CREATE INDEX idx_custom_quotes_email ON custom_quotes(customer_email);
CREATE INDEX idx_custom_quotes_status ON custom_quotes(status);
CREATE INDEX idx_custom_quotes_stripe ON custom_quotes(stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;
CREATE INDEX idx_custom_quotes_created ON custom_quotes(created_at DESC);

-- Add FK from order_items to custom_quotes
ALTER TABLE order_items
  ADD CONSTRAINT fk_custom_quote
  FOREIGN KEY (custom_quote_id)
  REFERENCES custom_quotes(id)
  ON DELETE SET NULL;

-- ============================================
-- EMAIL TEMPLATES TABLE
-- ============================================

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  variables JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_email_templates_key ON email_templates(key);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'ops',
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_admin_users_auth ON admin_users(auth_user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(active) WHERE active = true;

-- ============================================
-- SETTINGS TABLE (key-value store for app config)
-- ============================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at
  BEFORE UPDATE ON product_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_quotes_updated_at
  BEFORE UPDATE ON custom_quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read for published collections
CREATE POLICY "Public can read published collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (published_at IS NOT NULL AND published_at <= NOW());

-- Public read for published products
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Public read for product images of published products
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id 
      AND products.status = 'published'
    )
  );

-- Public read for product options of published products
CREATE POLICY "Public can read product options"
  ON product_options FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_options.product_id 
      AND products.status = 'published'
    )
  );

-- Anon can insert custom quotes
CREATE POLICY "Anon can insert custom quotes"
  ON custom_quotes FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated customers can read their own orders
CREATE POLICY "Customers can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can read their own order items
CREATE POLICY "Customers can read own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE customer_id IN (
        SELECT id FROM customers 
        WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Authenticated customers can read their own addresses
CREATE POLICY "Customers can read own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can insert addresses
CREATE POLICY "Customers can insert addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can update their own addresses
CREATE POLICY "Customers can update own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can delete their own addresses
CREATE POLICY "Customers can delete own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can read their own custom quotes
CREATE POLICY "Customers can read own quotes"
  ON custom_quotes FOR SELECT
  TO authenticated
  USING (
    customer_email IN (
      SELECT email FROM customers 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Authenticated customers can read their own customer record
CREATE POLICY "Customers can read own customer record"
  ON customers FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Authenticated customers can update their own customer record
CREATE POLICY "Customers can update own customer record"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Service role has full access to all new tables
CREATE POLICY "Service role full access collections"
  ON collections FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access products"
  ON products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access product_images"
  ON product_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access product_options"
  ON product_options FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access customers"
  ON customers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access addresses"
  ON addresses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access order_items"
  ON order_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access custom_quotes"
  ON custom_quotes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access email_templates"
  ON email_templates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access admin_users"
  ON admin_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access settings"
  ON settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate human-readable order number (WA-YYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
  new_order_number TEXT;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYMMDD');
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
  new_order_number := 'WA-' || date_part || '-' || random_part;
  
  -- Ensure uniqueness (extremely rare collision)
  WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) LOOP
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    new_order_number := 'WA-' || date_part || '-' || random_part;
  END LOOP;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- ============================================
-- INITIAL DATA: DEFAULT SETTINGS
-- ============================================

INSERT INTO settings (key, value, description) VALUES
  ('lead_time_rtw_shirt', '{"days": 10}', 'RTW shirt production lead time in days'),
  ('lead_time_rtw_trouser', '{"days": 10}', 'RTW trouser production lead time in days'),
  ('lead_time_rtw_denim', '{"days": 14}', 'RTW denim production lead time in days'),
  ('lead_time_custom_shirt', '{"days": 21}', 'Custom shirt production lead time in days'),
  ('lead_time_custom_trouser', '{"days": 21}', 'Custom trouser production lead time in days'),
  ('lead_time_custom_denim', '{"days": 28}', 'Custom denim production lead time in days'),
  ('shipping_domestic_days', '{"days": 3, "rate_cents": 0}', 'Domestic US shipping (free)'),
  ('shipping_international_days', '{"days": 10, "rate_cents": 2500}', 'International shipping ($25)'),
  ('contact_email', '"support@weavers.studio"', 'Customer support email'),
  ('contact_phone', '"+1 (555) 123-4567"', 'Customer support phone')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- INITIAL DATA: DEFAULT EMAIL TEMPLATES
-- ============================================

INSERT INTO email_templates (key, name, subject, html_body, text_body, variables) VALUES
  (
    'order_confirmed',
    'Order Confirmation',
    'Your Weavers Order #{{order_number}} is Confirmed',
    '<h1>Thank you for your order</h1><p>Hi {{customer_name}},</p><p>Your order #{{order_number}} has been confirmed and is now in production.</p><p><strong>Estimated delivery:</strong> {{estimated_delivery}}</p><p><a href="{{track_url}}">Track your order</a></p>',
    'Thank you for your order, {{customer_name}}. Your order #{{order_number}} has been confirmed. Track it at: {{track_url}}',
    '["order_number", "customer_name", "estimated_delivery", "track_url"]'
  ),
  (
    'order_shipped',
    'Order Shipped',
    'Your Order #{{order_number}} Has Shipped',
    '<h1>Your order is on its way</h1><p>Hi {{customer_name}},</p><p>Great news! Your order #{{order_number}} has shipped.</p><p><strong>Tracking:</strong> <a href="{{tracking_url}}">{{tracking_number}}</a></p>',
    'Hi {{customer_name}}, your order #{{order_number}} has shipped. Track it: {{tracking_url}}',
    '["order_number", "customer_name", "tracking_number", "tracking_url"]'
  ),
  (
    'quote_received',
    'Custom Quote Request Received',
    'We Received Your Custom Request',
    '<h1>Custom Request Received</h1><p>Hi {{customer_name}},</p><p>Thank you for your interest in a custom piece. Our team is reviewing your request and will send you a quote within 24-48 hours.</p><p><strong>Product:</strong> {{product_name}}</p>',
    'Hi {{customer_name}}, we received your custom request for {{product_name}}. We will send your quote within 24-48 hours.',
    '["customer_name", "product_name"]'
  ),
  (
    'quote_sent',
    'Your Custom Quote is Ready',
    'Your Custom Quote from Weavers',
    '<h1>Your Quote is Ready</h1><p>Hi {{customer_name}},</p><p>Your custom quote is ready:</p><p><strong>Price:</strong> ${{quoted_price}}</p><p><strong>Lead time:</strong> {{lead_time}} days</p><p><a href="{{invoice_url}}">Pay Invoice</a></p><p>This quote expires on {{expires_at}}.</p>',
    'Hi {{customer_name}}, your quote is ready: ${{quoted_price}}, {{lead_time}} days. Pay here: {{invoice_url}}',
    '["customer_name", "quoted_price", "lead_time", "invoice_url", "expires_at"]'
  ),
  (
    'account_welcome',
    'Welcome to Weavers',
    'Welcome to Weavers',
    '<h1>Welcome to Weavers</h1><p>Hi {{customer_name}},</p><p>Your account has been created. You can now:</p><ul><li>Track your orders</li><li>Save your measurements</li><li>Manage your addresses</li></ul><p><a href="{{account_url}}">Go to your account</a></p>',
    'Welcome to Weavers, {{customer_name}}! Manage your account at: {{account_url}}',
    '["customer_name", "account_url"]'
  )
ON CONFLICT (key) DO NOTHING;
