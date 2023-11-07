import { z, defineCollection } from 'astro:content'

const talks = defineCollection({
  type: 'data',
})

const speakers = defineCollection({
  type: 'data',
})

export const collections = {
  talks,
  speakers,
}
