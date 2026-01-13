import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "gdalykgx",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

