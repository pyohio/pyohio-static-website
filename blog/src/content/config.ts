import { defineCollection, z } from "astro:content"

const posts = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    showDate: z.boolean().optional(),
    showHeroImage: z.boolean().optional(),
    heroImage: z.string().optional(),
  }),
})

export const collections = { posts }
