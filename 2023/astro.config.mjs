import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs';

import { SITE_CONFIG, ANALYTICS_CONFIG } from './src/utils/config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS_CONFIG.vendors.googleAnalytics.isEnabled
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE_CONFIG.site,
  base: SITE_CONFIG.base,
  trailingSlash: SITE_CONFIG.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
        ri: ['twitter-fill', 'facebook-box-fill', 'linkedin-box-fill', 'whatsapp-fill', 'mail-fill'],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
