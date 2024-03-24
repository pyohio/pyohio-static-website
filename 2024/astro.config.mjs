import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import { astroImageTools } from 'astro-imagetools'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pyohio.org/2024',
  base: '/2024',
  publicDir: './public-src',
  compressHTML: true,
  image: {
    domains: ['pyohio.org', 'pretalx.com', 'gravatar.com'],
  },
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    compress(),
    astroImageTools,
  ],
})
