import { defineField, defineType } from "sanity";

export default defineType({
  name: "repo",
  title: "Open Source Repo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
      description: "Live demo or deployed version (optional)",
    }),
    defineField({
      name: "screenshot",
      title: "Screenshot",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Screenshot or preview image of the project",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tech stack or feature tags (e.g., Next.js, TypeScript, Marketing)",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this repo prominently at the top",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "screenshot",
    },
  },
});

