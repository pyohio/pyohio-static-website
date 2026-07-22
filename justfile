# PyOhio static website

_default:
    @just --list

# Start 2026 dev server with live reload (extra args passed to rockgarden, e.g. `just dev -p 8001`)
dev *ARGS:
    cd 2026 && rockgarden dev {{ARGS}}

# Build the 2026 site
build:
    cd 2026 && rockgarden build --clean

# Full production build (all years + 2026)
build-prod: clean build
    mkdir -p ./public
    cp -r ./archive/20* ./public
    cp -r ./2026/_site ./public/2026
    cp -rv ./netlify-static/* ./public/

# Rebuild theme CSS
theme-css:
    cd 2026/_themes/pyohio && npm run build:css

# Clean build output
clean:
    rm -rf public
    rm -rf 2026/_site

# Fetch talks/speakers from PreTalx into 2026 content
pretalx-fetch *ARGS:
    uv run --project pyohio-cli pyohio pretalx fetch {{ARGS}}

# Generate per-page OpenGraph images for talks and speakers
og-generate *ARGS:
    uv run --project pyohio-cli pyohio og generate {{ARGS}}

# Render a single talk/speaker OG card to _og-templates/_preview.html
og-preview SLUG *ARGS:
    uv run --project pyohio-cli pyohio og preview {{SLUG}} {{ARGS}}

# Crop existing OG cards to 630x630 squares for social media (local-only)
og-square *ARGS:
    uv run --project pyohio-cli pyohio og square {{ARGS}}

# Generate 1920x1080 title slides for talks
slides-generate *ARGS:
    uv run --project pyohio-cli pyohio slides generate {{ARGS}}

# Render a single talk title slide to _slide-templates/_preview.html
slides-preview SLUG *ARGS:
    uv run --project pyohio-cli pyohio slides preview {{SLUG}} {{ARGS}}

# Render the solid-purple video-production frame (branding only)
slides-frame *ARGS:
    uv run --project pyohio-cli pyohio slides frame {{ARGS}}
