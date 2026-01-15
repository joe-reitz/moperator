import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "gdalykgx",
  dataset: "production",
  apiVersion: "2024-01-01",
  // Disable CDN to always fetch fresh content
  useCdn: false,
});

