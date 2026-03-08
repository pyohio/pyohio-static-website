# PyOhio static website

# Start 2026 dev server
dev:
    cd 2026 && rockgarden build --clean && rockgarden serve

# Build the 2026 site
build:
    cd 2026 && rockgarden build --clean

# Full production build (all years + 2026 preview)
build-prod: clean build
    mkdir -p ./public
    cp -r ./archive/20* ./public
    cp -r ./2026/_site ./public/next
    cp -rv ./netlify-static/* ./public/

# Clean build output
clean:
    rm -rf public
    rm -rf 2026/_site

