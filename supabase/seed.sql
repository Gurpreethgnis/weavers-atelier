-- Seed data for lookbook_items
-- Covers all 9 filter categories from §4.7

INSERT INTO lookbook_items (title, category, tags, image_url, instagram_url, description, featured, sort_order) VALUES

-- Shirts
('Classic Oxford in Slate Blue', 'shirts', ARRAY['oxford', 'casual', 'blue'], '/images/lookbook/shirt-oxford-blue.jpg', 'https://instagram.com/p/example1', 'A timeless oxford shirt with mother-of-pearl buttons and a soft spread collar.', true, 1),
('Linen Camp Collar', 'shirts', ARRAY['linen', 'summer', 'relaxed'], '/images/lookbook/shirt-linen-camp.jpg', 'https://instagram.com/p/example2', 'Breathable linen with a relaxed camp collar. Perfect for warm weather.', false, 2),

-- Trousers
('High-Waist Pleated Wool', 'trousers', ARRAY['wool', 'pleated', 'formal'], '/images/lookbook/trouser-wool-pleat.jpg', 'https://instagram.com/p/example3', 'Single-pleat wool trousers with a high rise and tapered leg.', true, 3),
('Slim Cotton Chinos', 'trousers', ARRAY['cotton', 'chinos', 'slim'], '/images/lookbook/trouser-chino-slim.jpg', 'https://instagram.com/p/example4', 'Versatile cotton chinos in a slim fit with a clean finish.', false, 4),

-- Denim
('Embroidered Selvedge Denim', 'denim', ARRAY['embroidery', 'selvedge', 'statement'], '/images/lookbook/denim-embroidered.jpg', 'https://instagram.com/p/example5', 'Japanese selvedge with custom floral embroidery on the back pocket.', true, 5),
('Contrast Stitch Black Denim', 'denim', ARRAY['black', 'contrast', 'slim'], '/images/lookbook/denim-contrast.jpg', 'https://instagram.com/p/example6', 'Deep black denim with gold contrast stitching throughout.', false, 6),
('Patchwork Vintage Wash', 'denim', ARRAY['patchwork', 'vintage', 'statement'], '/images/lookbook/denim-patchwork.jpg', 'https://instagram.com/p/example7', 'Custom patchwork denim with varied washes and textures.', false, 7),

-- Weddingwear
('Ivory Sherwani with Gold Zari', 'weddingwear', ARRAY['sherwani', 'groom', 'ivory', 'zari'], '/images/lookbook/wedding-sherwani-ivory.jpg', 'https://instagram.com/p/example8', 'A regal ivory sherwani with intricate gold zari work for the groom.', true, 8),
('Navy Bandhgala Suit', 'weddingwear', ARRAY['bandhgala', 'navy', 'formal'], '/images/lookbook/wedding-bandhgala.jpg', 'https://instagram.com/p/example9', 'Modern navy bandhgala with subtle brocade texture.', false, 9),

-- Kurtas
('White Chikankari Kurta', 'kurtas', ARRAY['chikankari', 'white', 'traditional'], '/images/lookbook/kurta-chikankari.jpg', 'https://instagram.com/p/example10', 'Hand-embroidered white chikankari kurta for festive occasions.', true, 10),
('Black Silk Kurta with Mirror Work', 'kurtas', ARRAY['silk', 'black', 'mirror'], '/images/lookbook/kurta-mirror.jpg', 'https://instagram.com/p/example11', 'Luxurious black silk kurta with subtle mirror work details.', false, 11),

-- Blazers
('Velvet Dinner Jacket', 'blazers', ARRAY['velvet', 'evening', 'burgundy'], '/images/lookbook/blazer-velvet.jpg', 'https://instagram.com/p/example12', 'A rich burgundy velvet dinner jacket for evening events.', true, 12),
('Linen Summer Blazer', 'blazers', ARRAY['linen', 'summer', 'beige'], '/images/lookbook/blazer-linen.jpg', 'https://instagram.com/p/example13', 'Unlined beige linen blazer for warm weather elegance.', false, 13),

-- Waistcoats
('Brocade Wedding Waistcoat', 'waistcoats', ARRAY['brocade', 'wedding', 'gold'], '/images/lookbook/waistcoat-brocade.jpg', 'https://instagram.com/p/example14', 'Rich brocade waistcoat in gold, perfect for wedding ceremonies.', true, 14),
('Wool Herringbone Vest', 'waistcoats', ARRAY['wool', 'herringbone', 'classic'], '/images/lookbook/waistcoat-herringbone.jpg', 'https://instagram.com/p/example15', 'Classic wool herringbone vest for layered looks.', false, 15),

-- Embroidery
('Thread Work Denim Jacket', 'embroidery', ARRAY['denim', 'jacket', 'floral'], '/images/lookbook/embroidery-denim-jacket.jpg', 'https://instagram.com/p/example16', 'Custom floral thread work on a structured denim jacket.', true, 16),
('Monogrammed Shirt Cuff', 'embroidery', ARRAY['monogram', 'shirt', 'personalized'], '/images/lookbook/embroidery-monogram.jpg', 'https://instagram.com/p/example17', 'Elegant monogram embroidery on shirt cuffs.', false, 17),

-- Statement Pieces
('Hand-Painted Silk Shirt', 'statement_pieces', ARRAY['silk', 'handpainted', 'art'], '/images/lookbook/statement-silk-painted.jpg', 'https://instagram.com/p/example18', 'One-of-a-kind silk shirt with hand-painted abstract design.', true, 18),
('Four-Pocket Safari Jacket', 'statement_pieces', ARRAY['safari', 'utility', 'khaki'], '/images/lookbook/statement-safari.jpg', 'https://instagram.com/p/example19', 'Classic four-pocket safari jacket in washed khaki.', false, 19),
('Embroidered Suede Trucker', 'statement_pieces', ARRAY['suede', 'trucker', 'embroidered'], '/images/lookbook/statement-suede.jpg', 'https://instagram.com/p/example20', 'Tan suede trucker jacket with custom western-inspired embroidery.', false, 20);
