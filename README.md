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
- `/netlify-static/` — Static files copied directly to production build (e.g. `_redirects`, `robots.txt`)
- `/archive/` — All previous years' built sites (git submodule → [pyohio/pyohio-website-archive](https://github.com/pyohio/pyohio-website-archive))
- `/scripts/` — Python scripts for PreTalx data import

## Archiving a Year

Each year's site is built with whatever tooling that year used (Astro, Rockgarden, etc.) and only the **static build output** is preserved long-term — not the source. The archive lives in a separate repo (`pyohio/pyohio-website-archive`) that's pulled in here as a submodule at `/archive/`.

When a year wraps up:

1. Build a final production copy of the year's site (e.g. `just build` for 2026).
2. Push the resulting static output (the `_site/` contents, renamed to `<YEAR>/`) to the archive repo.
3. Update the submodule pointer here: `git submodule update --remote archive`, then commit the new pointer.
4. Remove the year's source directory from this repo (it's no longer needed; the archive is canonical).

The Netlify production build (`just build-prod`) copies `archive/20*` into `public/` alongside the current year's build, so all archived years are deployed together.

## Adding a New Current Year

When rolling over to a new year (e.g. archiving 2026 and starting 2027), several things need updating beyond just the year directory:

- **`justfile`** — `dev`, `build`, and `build-prod` recipes hardcode the current year's directory.
- **`netlify.toml`** — the build command may reference the current year if anything year-specific is needed; double-check.
- **`netlify-static/_redirects`** — the `/ /2026 302` rule and any year-agnostic short URLs (`/about`, `/coc`, etc.) point at the current year and must be bumped.
- **`netlify-static/sitemap.xml`** — the root sitemap index. Add a `<sitemap>` entry for the new year's sitemap (e.g. `https://www.pyohio.org/2027/sitemap.xml`) and keep the now-archived previous year listed. If the new year's tooling doesn't generate a sitemap, add its root URL to `netlify-static/sitemap-archives.xml` instead.

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
