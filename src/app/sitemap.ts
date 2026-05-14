import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://weaversatelier.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/lookbook`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/weddingwear`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/statement-pieces`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fit-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns-alterations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch dynamic content from Supabase
  let collectionPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch published collections
      const { data: collections } = await supabase
        .from("collections")
        .select("slug, updated_at")
        .not("published_at", "is", null)
        .order("sort_order");

      if (collections) {
        collectionPages = collections.map((collection) => ({
          url: `${baseUrl}/shop/${collection.slug}`,
          lastModified: new Date(collection.updated_at || new Date()),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }));
      }

      // Fetch published products with their collection slugs
      const { data: products } = await supabase
        .from("products")
        .select(
          `
          slug,
          updated_at,
          collections!inner(slug)
        `
        )
        .eq("status", "published")
        .order("sort_order");

      if (products) {
        productPages = products.map((product) => {
          const collectionSlug = (
            product.collections as unknown as { slug: string }
          ).slug;
          return {
            url: `${baseUrl}/shop/${collectionSlug}/${product.slug}`,
            lastModified: new Date(product.updated_at || new Date()),
            changeFrequency: "weekly" as const,
            priority: 0.85,
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
  }

  return [...staticPages, ...collectionPages, ...productPages];
}
