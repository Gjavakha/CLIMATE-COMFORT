#!/usr/bin/env sh
# Assembles the static site into ./dist for hosting (Cloudflare Pages).
# The real work is in build.mjs (Node 18+): it copies the site files, fetches
# the published catalog from Supabase and pre-renders one HTML page per
# product and category, plus sitemap.xml.
#
#   sh build.sh            → ./dist
#   Cloudflare Pages:  build command "sh build.sh", output directory "dist"
set -eu
cd "$(dirname "$0")"
node build.mjs
