# PyOhio static website

# Start 2026 dev server
dev:
    cd 2026 && rockgarden build --clean && rockgarden serve

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

