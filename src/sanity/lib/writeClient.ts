import { createClient } from "next-sanity";

// This client has write access - only use server-side
export const writeClient = createClient({
  projectId: "gdalykgx",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});


