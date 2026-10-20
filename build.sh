#!/usr/bin/env sh
# Assembles the static site into ./dist for hosting (Cloudflare Pages).
# Only the files a browser needs are copied — never the Edge Function sources,
# the schema, the README, supplier spreadsheets or local tooling.
#
#   sh build.sh            → ./dist
#   Cloudflare Pages:  build command "sh build.sh", output directory "dist"
#   Direct upload:     npx wrangler pages deploy dist --project-name climate-comfort
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist/admin dist/assets
cp index.html app.js analytics.js styles.css supabase-config.js robots.txt sitemap.xml dist/
cp _headers dist/
cp admin/index.html admin/admin.css admin/admin.js admin/importer.js admin/importer-profiles.js dist/admin/
cp assets/* dist/assets/
echo "dist ready: $(find dist -type f | wc -l) files"
