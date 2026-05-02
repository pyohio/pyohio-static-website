# PyOhio 2026 Site

The 2026 conference site, built with [Rockgarden](https://rockgarden.build/) (a Python static site generator using Markdown and Jinja2).

## Structure

- `content/` — Markdown pages with YAML frontmatter
- `_themes/pyohio/` — Custom theme (templates, components, layouts)
  - `static-src/input.css` — Tailwind v4 + DaisyUI theme source
  - `static/rockgarden.css` — Compiled CSS output
- `_static/` — Images, favicon, and other static assets
- `rockgarden.toml` — Site configuration

## Development

Run these from the repo root:

```bash
just dev         # Start the 2026 dev server
just build       # Build the 2026 site
just theme-css   # Rebuild theme CSS after editing input.css or templates
```

See the top-level `README.md` for more on the theme and multi-year setup.
