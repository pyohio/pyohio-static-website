// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content'

const talks = defineCollection({
  type: 'data',
})

const speakers = defineCollection({
  type: 'data',
})

const sponsors = defineCollection({
  type: 'data',
})

const individualSponsors = defineCollection({
  type: 'data',
})

export const collections = {
  talks,
  speakers,
  sponsors,
  individualSponsors,
}
