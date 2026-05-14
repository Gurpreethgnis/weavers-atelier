/**
 * Seed script: Create sample products and collections for launch
 *
 * This script creates the minimum seed content required for launch:
 * - 3 collections per category (shirts, trousers, denim)
 * - 6 shirts, 4 trousers, 4 denim products
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set
 *   - The database tables must exist (run migrations first)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL"];

interface CollectionSeed {
  slug: string;
  category: "shirt" | "trouser" | "denim";
  name: string;
  description: string;
  hero_image_url: string | null;
  sort_order: number;
}

interface ProductSeed {
  slug: string;
  collection_slug: string;
  name: string;
  description: string;
  base_price_cents: number;
  lead_time_days: number;
  custom_available: boolean;
  rtw_available: boolean;
  sizes: string[];
  category: "shirt" | "trouser" | "denim";
  sort_order: number;
  seo_title: string;
  seo_description: string;
}

const collections: CollectionSeed[] = [
  // Shirts
  {
    slug: "shirts",
    category: "shirt",
    name: "Custom Shirts",
    description:
      "Premium dress shirts and casual buttondowns made to your measurements or in standard sizes.",
    hero_image_url: null,
    sort_order: 1,
  },
  {
    slug: "oxford-collection",
    category: "shirt",
    name: "Oxford Collection",
    description:
      "Classic Oxford cloth buttondowns in timeless colors and fits.",
    hero_image_url: null,
    sort_order: 2,
  },
  {
    slug: "linen-shirts",
    category: "shirt",
    name: "Linen Shirts",
    description:
      "Lightweight linen shirts perfect for warm weather and resort wear.",
    hero_image_url: null,
    sort_order: 3,
  },
  // Trousers
  {
    slug: "trousers",
    category: "trouser",
    name: "Tailored Trousers",
    description:
      "From dress trousers to casual chinos, expertly crafted for the perfect fit.",
    hero_image_url: null,
    sort_order: 1,
  },
  {
    slug: "chino-collection",
    category: "trouser",
    name: "Chino Collection",
    description:
      "Premium cotton chinos in a range of colors for everyday versatility.",
    hero_image_url: null,
    sort_order: 2,
  },
  {
    slug: "wool-trousers",
    category: "trouser",
    name: "Wool Trousers",
    description:
      "Luxurious wool trousers for business and formal occasions.",
    hero_image_url: null,
    sort_order: 3,
  },
  // Denim
  {
    slug: "denim",
    category: "denim",
    name: "Statement Denim",
    description:
      "Premium jeans with custom embroidery, washes, and artisan details.",
    hero_image_url: null,
    sort_order: 1,
  },
  {
    slug: "raw-denim",
    category: "denim",
    name: "Raw Denim",
    description:
      "Unwashed selvedge denim that develops unique character over time.",
    hero_image_url: null,
    sort_order: 2,
  },
  {
    slug: "embroidered-denim",
    category: "denim",
    name: "Embroidered Denim",
    description: "Jeans elevated with custom embroidery and artisan details.",
    hero_image_url: null,
    sort_order: 3,
  },
];

const products: ProductSeed[] = [
  // Shirts (6)
  {
    slug: "classic-white-dress-shirt",
    collection_slug: "shirts",
    name: "Classic White Dress Shirt",
    description:
      "<p>The foundation of every wardrobe. Crafted from premium Egyptian cotton with a spread collar and French cuffs.</p><p>Perfect for business, weddings, and formal occasions.</p>",
    base_price_cents: 14900,
    lead_time_days: 14,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 1,
    seo_title: "Classic White Dress Shirt | Weavers Atelier",
    seo_description:
      "Premium Egyptian cotton dress shirt with spread collar and French cuffs. Available in standard sizes or custom-made to your measurements.",
  },
  {
    slug: "navy-oxford",
    collection_slug: "oxford-collection",
    name: "Navy Oxford Buttondown",
    description:
      "<p>A wardrobe essential. Soft oxford cloth in deep navy with a button-down collar and single-button cuffs.</p><p>Versatile enough for the office or weekend.</p>",
    base_price_cents: 12900,
    lead_time_days: 12,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 2,
    seo_title: "Navy Oxford Buttondown | Weavers Atelier",
    seo_description:
      "Classic oxford buttondown in deep navy. Made from soft cotton oxford cloth, available in standard sizes or custom fit.",
  },
  {
    slug: "white-oxford",
    collection_slug: "oxford-collection",
    name: "White Oxford Buttondown",
    description:
      "<p>The versatile white oxford. Soft, textured cotton with a button-down collar.</p><p>Dress it up with a blazer or down with jeans.</p>",
    base_price_cents: 12900,
    lead_time_days: 12,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 3,
    seo_title: "White Oxford Buttondown | Weavers Atelier",
    seo_description:
      "Classic white oxford buttondown shirt. Soft cotton, button-down collar. Standard sizes or custom measurements.",
  },
  {
    slug: "sky-blue-dress-shirt",
    collection_slug: "shirts",
    name: "Sky Blue Dress Shirt",
    description:
      "<p>Elegant sky blue in fine cotton poplin. Point collar with mother-of-pearl buttons.</p><p>A refined alternative to white for business and formal wear.</p>",
    base_price_cents: 14900,
    lead_time_days: 14,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 4,
    seo_title: "Sky Blue Dress Shirt | Weavers Atelier",
    seo_description:
      "Elegant sky blue dress shirt in fine cotton poplin. Available in standard sizes or made to your measurements.",
  },
  {
    slug: "white-linen-shirt",
    collection_slug: "linen-shirts",
    name: "White Linen Shirt",
    description:
      "<p>Pure European linen in crisp white. Relaxed fit with a camp collar.</p><p>Perfect for beach weddings, summer events, and resort wear.</p>",
    base_price_cents: 15900,
    lead_time_days: 14,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 5,
    seo_title: "White Linen Shirt | Weavers Atelier",
    seo_description:
      "Premium European linen shirt in white. Relaxed fit with camp collar. Ideal for warm weather and resort wear.",
  },
  {
    slug: "striped-bengal-shirt",
    collection_slug: "shirts",
    name: "Bengal Stripe Dress Shirt",
    description:
      "<p>Classic blue and white Bengal stripes in fine Egyptian cotton. Spread collar with barrel cuffs.</p><p>A timeless pattern for the modern professional.</p>",
    base_price_cents: 15900,
    lead_time_days: 14,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "shirt",
    sort_order: 6,
    seo_title: "Bengal Stripe Dress Shirt | Weavers Atelier",
    seo_description:
      "Blue and white Bengal stripe dress shirt in Egyptian cotton. Classic pattern, modern fit. Standard or custom sizes.",
  },
  // Trousers (4)
  {
    slug: "navy-wool-trouser",
    collection_slug: "wool-trousers",
    name: "Navy Wool Dress Trouser",
    description:
      "<p>Super 120s wool in deep navy. Flat front with a medium break.</p><p>The essential dress trouser for business and formal occasions.</p>",
    base_price_cents: 21900,
    lead_time_days: 18,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "trouser",
    sort_order: 1,
    seo_title: "Navy Wool Dress Trouser | Weavers Atelier",
    seo_description:
      "Premium Super 120s wool dress trousers in navy. Flat front, medium break. Available in standard sizes or custom fit.",
  },
  {
    slug: "khaki-chino",
    collection_slug: "chino-collection",
    name: "Classic Khaki Chino",
    description:
      "<p>Premium brushed cotton in classic khaki. Flat front with a tapered leg.</p><p>The versatile chino that works from office to weekend.</p>",
    base_price_cents: 11900,
    lead_time_days: 12,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "trouser",
    sort_order: 2,
    seo_title: "Classic Khaki Chino | Weavers Atelier",
    seo_description:
      "Premium cotton chinos in classic khaki. Flat front, tapered leg. Standard sizes or custom measurements.",
  },
  {
    slug: "charcoal-wool-trouser",
    collection_slug: "wool-trousers",
    name: "Charcoal Wool Trouser",
    description:
      "<p>Super 110s wool in versatile charcoal. Single pleat with a classic fit.</p><p>A refined trouser for board rooms and evening events.</p>",
    base_price_cents: 21900,
    lead_time_days: 18,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "trouser",
    sort_order: 3,
    seo_title: "Charcoal Wool Trouser | Weavers Atelier",
    seo_description:
      "Charcoal wool trousers in Super 110s. Single pleat, classic fit. Standard sizes or made to measure.",
  },
  {
    slug: "navy-chino",
    collection_slug: "chino-collection",
    name: "Navy Chino",
    description:
      "<p>Crisp navy cotton twill with a slim fit. Flat front with side tabs.</p><p>A sharp alternative to khaki that pairs with everything.</p>",
    base_price_cents: 11900,
    lead_time_days: 12,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "trouser",
    sort_order: 4,
    seo_title: "Navy Chino | Weavers Atelier",
    seo_description:
      "Navy cotton chinos with slim fit. Flat front, side tabs. Available in standard sizes or custom made.",
  },
  // Denim (4)
  {
    slug: "classic-indigo-selvedge",
    collection_slug: "raw-denim",
    name: "Classic Indigo Selvedge",
    description:
      "<p>14oz Japanese selvedge denim in deep indigo. Raw, unwashed, and ready to fade beautifully.</p><p>Straight leg with a mid-rise.</p>",
    base_price_cents: 22900,
    lead_time_days: 18,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "denim",
    sort_order: 1,
    seo_title: "Classic Indigo Selvedge Jeans | Weavers Atelier",
    seo_description:
      "Premium 14oz Japanese selvedge denim. Raw indigo, straight leg. Develops unique character over time.",
  },
  {
    slug: "embroidered-dark-wash",
    collection_slug: "embroidered-denim",
    name: "Artisan Embroidered Jean",
    description:
      "<p>Dark wash denim elevated with subtle hand embroidery along the back pockets.</p><p>Statement details that reveal themselves up close.</p>",
    base_price_cents: 34900,
    lead_time_days: 21,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "denim",
    sort_order: 2,
    seo_title: "Artisan Embroidered Jeans | Weavers Atelier",
    seo_description:
      "Dark wash jeans with hand embroidery details. Premium denim with artisan craftsmanship.",
  },
  {
    slug: "black-selvedge",
    collection_slug: "raw-denim",
    name: "Black Selvedge Jean",
    description:
      "<p>14oz Japanese selvedge in deep black. Raw construction with white selvedge edge.</p><p>Slim-straight fit for a modern silhouette.</p>",
    base_price_cents: 22900,
    lead_time_days: 18,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "denim",
    sort_order: 3,
    seo_title: "Black Selvedge Jeans | Weavers Atelier",
    seo_description:
      "Premium black selvedge denim. 14oz Japanese fabric, slim-straight fit. Raw and ready to fade.",
  },
  {
    slug: "contrast-stitch-indigo",
    collection_slug: "denim",
    name: "Contrast Stitch Jean",
    description:
      "<p>Classic indigo with bold contrast stitching in gold thread. A statement piece that stands out.</p><p>Relaxed fit with a tapered leg.</p>",
    base_price_cents: 24900,
    lead_time_days: 18,
    custom_available: true,
    rtw_available: true,
    sizes: STANDARD_SIZES,
    category: "denim",
    sort_order: 4,
    seo_title: "Contrast Stitch Jeans | Weavers Atelier",
    seo_description:
      "Indigo jeans with bold gold contrast stitching. Statement denim with relaxed, tapered fit.",
  },
];

async function seedContent() {
  console.log("Starting seed: Collections and Products\n");

  // First, create collections
  console.log("Creating collections...");
  const collectionIdMap: Record<string, string> = {};

  for (const collection of collections) {
    const { data, error } = await supabase
      .from("collections")
      .upsert(
        {
          slug: collection.slug,
          category: collection.category,
          name: collection.name,
          description: collection.description,
          hero_image_url: collection.hero_image_url,
          sort_order: collection.sort_order,
          published_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      console.error(`Error creating collection ${collection.slug}:`, error.message);
    } else if (data) {
      collectionIdMap[collection.slug] = data.id;
      console.log(`✓ Collection: ${collection.name}`);
    }
  }

  // Then create products
  console.log("\nCreating products...");

  for (const product of products) {
    const collectionId = collectionIdMap[product.collection_slug];
    if (!collectionId) {
      console.error(`Collection not found: ${product.collection_slug}`);
      continue;
    }

    const { data, error } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          collection_id: collectionId,
          name: product.name,
          description: product.description,
          base_price_cents: product.base_price_cents,
          lead_time_days: product.lead_time_days,
          custom_available: product.custom_available,
          rtw_available: product.rtw_available,
          sizes: product.sizes,
          category: product.category,
          status: "published",
          sort_order: product.sort_order,
          seo_title: product.seo_title,
          seo_description: product.seo_description,
          currency: "USD",
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      console.error(`Error creating product ${product.slug}:`, error.message);
    } else if (data) {
      console.log(`✓ Product: ${product.name} ($${product.base_price_cents / 100})`);
    }
  }

  console.log("\n--- Seed Complete ---");
  console.log(`Collections: ${collections.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`\nNote: Product images must be added via the admin panel.`);
}

seedContent().catch(console.error);
