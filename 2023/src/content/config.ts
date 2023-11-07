import { z, defineCollection } from 'astro:content'

const talkCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    code: z.string(),
  }),
})

const speakerCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    code: z.string(),
  }),
})

export const collections = {
  talks: talkCollection,
  speakers: speakerCollection,
}
