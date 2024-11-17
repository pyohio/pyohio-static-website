// @ts-check
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"

import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://www.pyohio.org/blog",
  base: "/blog",
  integrations: [mdx(), sitemap()],
})
