---
title: Using Decap CMS with an Astro site
publishDate: 16 May 2022
author: Advanced Astro
authorURL: https://advanced-astro.dev
description: How to get started using Decap CMS to manage your Astro site’s content
layout: ../../layouts/BlogPost.astro
---
[Decap CMS](https://decapcms.org/) is an open-source, Git-based content management system.
It provides a single-page app for editing content and can publish that content by committing it to a hosted Git repo (for example on GitHub or GitLab).

Adding Decap CMS to an [Astro](https://astro.build/) site would usually involve creating a number of files in different parts of your project directory and then keeping all those moving parts in sync. With the [`astro-decap-cms`](https://github.com/advanced-astro/astro-decap-cms/) integration, you configure the integration in your `astro.config.mjs` file and the integration takes care of the rest.

```javascript
import { defineConfig } from 'astro/config';
import DecapCMS from 'astro-decap-cms';

export default defineConfig({
  integrations: [
    DecapCMS({
      config: {
        backend: {
          name: 'git-gateway',
          branch: 'main',
        },
        collections: [
          // Content collections
        ],
      },
    }),
  ],
});
```
