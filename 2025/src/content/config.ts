import { defineCollection, z } from 'astro:content'

const speakers = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    social: z.object({
      website: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      mastodon: z.string().optional(),
    }).optional(),
  }),
})

const talks = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    type: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    room: z.string().optional(),
    speakers: z.array(z.object({
      name: z.string(),
      slug: z.string(),
    })),
  }),
})

const sponsors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    website: z.string().optional(),
    tier: z.object({
      name: z.string(),
      display_order: z.number(),
    }),
  }),
})

const individualSponsors = defineCollection({
  type: 'data',
  schema: z.object({
    sponsors: z.array(z.object({
      name: z.string(),
      amount: z.number().optional(),
    })),
  }),
})

// Define jsonData collection to prevent auto-generation warning
const jsonData = defineCollection({
  type: 'data',
  schema: z.any(), // Allow any structure for JSON data
})

export const collections = {
  speakers,
  talks,
  sponsors,
  individualSponsors,
  jsonData,
}