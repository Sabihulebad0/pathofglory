import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "options", title: "Options" },
    { name: "merch", title: "Merchandising" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The product URL: /products/<slug>",
      group: "content",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "content",
      description: "First image is the card image; the second shows on hover.",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (rule) => rule.min(1),
    }),

    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      group: "pricing",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "compareAt",
      title: "Compare-at price",
      type: "number",
      description: "Original price, shown struck through. Leave empty when not on sale.",
      group: "pricing",
      validation: (rule) => rule.min(0),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "options",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gender",
      title: "Gender",
      type: "string",
      group: "options",
      initialValue: "unisex",
      options: {
        list: [
          { title: "Men", value: "men" },
          { title: "Women", value: "women" },
          { title: "Unisex", value: "unisex" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      group: "options",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "colors",
      title: "Colours",
      type: "array",
      group: "options",
      of: [
        defineArrayMember({
          type: "object",
          name: "color",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "hex",
              title: "Hex",
              type: "string",
              description: "e.g. #1E5EFF",
              validation: (r) =>
                r.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: "hex colour" }),
            }),
          ],
          preview: { select: { title: "name", subtitle: "hex" } },
        }),
      ],
    }),

    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      group: "merch",
      options: {
        list: [
          { title: "New", value: "New" },
          { title: "Sale", value: "Sale" },
          { title: "Bestseller", value: "Bestseller" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "isNew",
      title: "Show in New Arrivals",
      type: "boolean",
      group: "merch",
      initialValue: false,
    }),
    defineField({
      name: "isBestseller",
      title: "Show in Bestsellers",
      type: "boolean",
      group: "merch",
      initialValue: false,
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      group: "merch",
      initialValue: 5,
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: "reviews",
      title: "Review count",
      type: "number",
      group: "merch",
      initialValue: 0,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "merch",
      description: "Lower numbers appear first across the storefront.",
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Price, high to low", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: typeof subtitle === "number" ? `$${subtitle}` : undefined,
      media,
    }),
  },
});
