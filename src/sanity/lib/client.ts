import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "gdalykgx",
  dataset: "production",
  apiVersion: "2024-01-01",
  // Served from Sanity's edge CDN. Freshness comes from ISR + the
  // revalidatePath calls in the Sanity webhook, not from bypassing the cache.
  useCdn: true,
  perspective: "published",
});
