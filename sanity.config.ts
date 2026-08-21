import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { GenerateSeoAction } from "./src/sanity/actions/generateSeoAction";

export default defineConfig({
  name: "default",
  title: "The mOperator",
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
        return [...prev, GenerateSeoAction];
      }
      return prev;
    },
  },
});
