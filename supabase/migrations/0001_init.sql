-- Weavers Atelier Database Schema
-- Based on §8 Data Model from implementation prompt

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE lead_type AS ENUM (
  'general',
  'shirt',
  'trouser',
  'denim',
  'weddingwear',
  'statement_piece',
  'instagram_recreate',
  'measurement_help',
  'consultation'
);

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'awaiting_customer',
  'consultation_booked',
  'quoted',
  'converted',
  'closed_lost',
  'spam'
);

CREATE TYPE order_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'measurement_review',
  'quote_needed',
  'quote_sent',
  'payment_pending',
  'confirmed',
  'in_production',
  'ready_to_dispatch',
  'dispatched',
  'delivered',
  'alteration_support',
  'completed',
  'cancelled'
);

CREATE TYPE consultation_status AS ENUM (
  'requested',
  'scheduled',
  'completed',
  'no_show',
  'converted',
  'cancelled'
);

CREATE TYPE measurement_method AS ENUM (
  'body',
  'garment',
  'reference_upload',
  'video_fitting'
);

CREATE TYPE measurement_unit AS ENUM (
  'inches',
  'cm'
);

CREATE TYPE garment_category AS ENUM (
  'shirt',
  'trouser',
  'jeans',
  'jacket',
  'weddingwear',
  'kurta',
  'waistcoat',
  'blazer'
);

CREATE TYPE fit_preference AS ENUM (
  'slim',
  'regular',
  'relaxed',
  'oversized'
);

CREATE TYPE measurement_confidence AS ENUM (
  'very_confident',
  'somewhat_confident',
  'please_review',
  'video_fitting_requested'
);

CREATE TYPE consultation_type AS ENUM (
  'shirt_fit',
  'trouser_fit',
  'denim_design',
  'weddingwear',
  'statement_piece',
  'instagram_look',
  'video_measurement'
);

CREATE TYPE lookbook_category AS ENUM (
  'shirts',
  'trousers',
  'denim',
  'weddingwear',
  'kurtas',
  'blazers',
  'waistcoats',
  'embroidery',
  'statement_pieces'
);

CREATE TYPE contact_method AS ENUM (
  'email',
  'phone',
  'whatsapp'
);

CREATE TYPE reference_entity_type AS ENUM (
  'lead',
  'order',
  'measurement',
  'consultation'
);

-- ============================================
-- TABLES
-- ============================================

-- §8.1 Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_page TEXT NOT NULL,
  lead_type lead_type NOT NULL DEFAULT 'general',
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  country TEXT,
  city TEXT,
  preferred_contact_method contact_method,
  garment_interest TEXT,
  need_by_date DATE,
  budget_range TEXT,
  notes TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  internal_notes TEXT,
  
  CONSTRAINT email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL OR whatsapp IS NOT NULL)
);

-- §8.2 Custom Order Requests
CREATE TABLE custom_order_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  garment_type TEXT NOT NULL,
  category garment_category NOT NULL,
  selected_options JSONB NOT NULL DEFAULT '{}',
  measurement_method measurement_method,
  measurement_id UUID,
  need_by_date DATE,
  budget_range TEXT,
  status order_status NOT NULL DEFAULT 'submitted',
  internal_notes TEXT
);

-- §8.3 Measurement Profiles
CREATE TABLE measurement_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  unit measurement_unit NOT NULL,
  method measurement_method NOT NULL,
  garment_category garment_category NOT NULL,
  body_measurements JSONB,
  garment_measurements JSONB,
  height TEXT,
  weight TEXT,
  usual_size TEXT,
  fit_preference fit_preference,
  confidence_level measurement_confidence NOT NULL DEFAULT 'somewhat_confident',
  notes TEXT
);

-- Add FK from custom_order_requests to measurement_profiles
ALTER TABLE custom_order_requests
  ADD CONSTRAINT fk_measurement
  FOREIGN KEY (measurement_id)
  REFERENCES measurement_profiles(id)
  ON DELETE SET NULL;

-- §8.4 Consultation Requests
CREATE TABLE consultation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  consultation_type consultation_type NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  timezone TEXT,
  event_date DATE,
  need_by_date DATE,
  garment_type TEXT,
  budget_range TEXT,
  status consultation_status NOT NULL DEFAULT 'requested',
  notes TEXT,
  internal_notes TEXT
);

-- §8.5 Lookbook Items
CREATE TABLE lookbook_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  category lookbook_category NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  video_url TEXT,
  instagram_url TEXT,
  description TEXT,
  cta_label TEXT DEFAULT 'Recreate This Look',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- §8.6 Uploaded References
CREATE TABLE uploaded_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  related_entity_type reference_entity_type NOT NULL,
  related_entity_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  notes TEXT
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_lead_type ON leads(lead_type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email) WHERE email IS NOT NULL;

CREATE INDEX idx_orders_status ON custom_order_requests(status);
CREATE INDEX idx_orders_lead_id ON custom_order_requests(lead_id);
CREATE INDEX idx_orders_created_at ON custom_order_requests(created_at DESC);

CREATE INDEX idx_measurements_lead_id ON measurement_profiles(lead_id);
CREATE INDEX idx_measurements_category ON measurement_profiles(garment_category);

CREATE INDEX idx_consultations_status ON consultation_requests(status);
CREATE INDEX idx_consultations_lead_id ON consultation_requests(lead_id);
CREATE INDEX idx_consultations_type ON consultation_requests(consultation_type);

CREATE INDEX idx_lookbook_category ON lookbook_items(category);
CREATE INDEX idx_lookbook_featured ON lookbook_items(featured) WHERE featured = TRUE;
CREATE INDEX idx_lookbook_sort ON lookbook_items(sort_order);

CREATE INDEX idx_references_entity ON uploaded_references(related_entity_type, related_entity_id);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON custom_order_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_measurements_updated_at
  BEFORE UPDATE ON measurement_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lookbook_updated_at
  BEFORE UPDATE ON lookbook_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_references ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT leads (form submissions)
CREATE POLICY "Anon can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can INSERT orders
CREATE POLICY "Anon can insert orders"
  ON custom_order_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can INSERT measurements
CREATE POLICY "Anon can insert measurements"
  ON measurement_profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can INSERT consultations
CREATE POLICY "Anon can insert consultations"
  ON consultation_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can INSERT references
CREATE POLICY "Anon can insert references"
  ON uploaded_references FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can SELECT lookbook items (public content)
CREATE POLICY "Anon can read lookbook"
  ON lookbook_items FOR SELECT
  TO anon
  USING (true);

-- Service role has full access (for admin/backend)
CREATE POLICY "Service role full access leads"
  ON leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access orders"
  ON custom_order_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access measurements"
  ON measurement_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access consultations"
  ON consultation_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access lookbook"
  ON lookbook_items FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access references"
  ON uploaded_references FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
