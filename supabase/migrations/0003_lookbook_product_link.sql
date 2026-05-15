-- ============================================
-- Migration: Add product linkage to lookbook_items
-- Purpose: Allow lookbook items to be purchased directly with standard sizing
-- ============================================

-- Add product_id FK to link lookbook items to products
ALTER TABLE lookbook_items 
ADD COLUMN product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- Add price_cents for items without a linked product (standalone pricing)
ALTER TABLE lookbook_items 
ADD COLUMN price_cents INTEGER;

-- Add sizes array for standard sizing options
ALTER TABLE lookbook_items 
ADD COLUMN sizes size_option[] DEFAULT ARRAY['S', 'M', 'L', 'XL']::size_option[];

-- Add rtw_available flag to indicate if ready-to-wear purchase is enabled
ALTER TABLE lookbook_items 
ADD COLUMN rtw_available BOOLEAN NOT NULL DEFAULT true;

-- Index for product lookup
CREATE INDEX idx_lookbook_product ON lookbook_items(product_id) WHERE product_id IS NOT NULL;

-- Comment explaining the dual-path system
COMMENT ON COLUMN lookbook_items.product_id IS 'Optional FK to products table. If set, uses product price/sizes. If null, uses lookbook_items own price_cents/sizes.';
COMMENT ON COLUMN lookbook_items.price_cents IS 'Standalone price when no product_id is linked. Ignored if product_id is set.';
COMMENT ON COLUMN lookbook_items.sizes IS 'Available sizes for standard purchase. Defaults to S-XL.';
COMMENT ON COLUMN lookbook_items.rtw_available IS 'If false, only custom path is shown (no add-to-cart).';
