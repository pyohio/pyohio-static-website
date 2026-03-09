# PyOhio Static Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/85a2eace-1a24-47a3-b6c6-739c9ca43cba/deploy-status)](https://app.netlify.com/sites/pyohio/deploys)

Multi-year static website for the PyOhio conference, hosted on Netlify. The 2026 site uses [Rockgarden](https://rockgarden.build/) (Python SSG) with a custom DaisyUI theme. Previous years are archived via a git submodule.

## Prerequisites

- Python 3.13+
- [just](https://github.com/casey/just) (command runner)
- [Rockgarden](https://rockgarden.build/) (`pip install rockgarden`)
- Node.js / npm (theme CSS rebuilds only)

## Development

```bash
# Start 2026 dev server
just dev

# Build the 2026 site
just build

# Full production build (all years + 2026 preview)
just build-prod

# Clean build output
just clean

# Rebuild theme CSS (after editing theme styles/templates)
just theme-css
```

## Theme Development

The 2026 site uses a custom theme at `2026/_themes/pyohio/` built with Tailwind CSS v4 + DaisyUI v5.

To modify the theme:

1. Edit CSS in `2026/_themes/pyohio/static-src/input.css`
2. Edit templates in `2026/_themes/pyohio/` (Jinja2)
3. Rebuild CSS: `just theme-css`
4. Rebuild site: `just build` or `just dev`

Theme CSS must be rebuilt after changing templates (Tailwind scans them for classes).

## Project Structure

- `/2026/` — Current year's site (Rockgarden)
  - `content/` — Markdown content pages (YAML frontmatter)
  - `_themes/pyohio/` — Custom theme (templates, CSS, static assets)
  - `rockgarden.toml` — Site configuration
- `/2025/` — Previous year's site (Astro, kept as reference)
- `/netlify-static/` — Static files copied directly to production build
- `/archive/` — Previous years (git submodule)
- `/scripts/` — Python scripts for PreTalx data import

## Archives of Previous Years

- [2025](https://www.pyohio.org/2025)
- [2024](https://www.pyohio.org/2024)
- [2023](https://www.pyohio.org/2023)
- [2022](https://www.pyohio.org/2022)
- [2021](https://www.pyohio.org/2021)
- [2020](https://www.pyohio.org/2020)
- [2019](https://www.pyohio.org/2019)
- [2018](https://www.pyohio.org/2018)
- [2017](https://www.pyohio.org/2017)
- See [Wayback Machine](https://web.archive.org/web/20240000000000*/https://www.pyohio.org/) for older archives.
