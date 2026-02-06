import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { generateSeoAction } from "./src/sanity/actions/generateSeoAction";

export default defineConfig({
  name: "default",
  title: "The MOPerator",
  projectId: "gdalykgx",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return [...prev, generateSeoAction];
      }
      return prev;
    },
  },
});
