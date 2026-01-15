import { defineField, defineType } from "sanity";

export default defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this subscriber is still active",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "subscribedAt",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle
          ? `Subscribed: ${new Date(subtitle).toLocaleDateString()}`
          : "No date",
      };
    },
  },
});



