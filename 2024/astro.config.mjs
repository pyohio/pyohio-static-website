import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import { astroImageTools } from 'astro-imagetools'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pyohio.org',
  base: '/2024',
  publicDir: './public-src',
  compressHTML: true,
  trailingSlash: 'ignore',
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
    icon(),
  ],
})
