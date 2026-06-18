#!/usr/bin/env bash
#
# deploy.sh — Sube el sitio estático (dist/) a un bucket S3 y purga el CDN.
#
# Uso:
#   cp .env.deploy.example .env.deploy   # y completa los valores reales
#   pnpm build                            # genera dist/ (lee noticias.json de S3)
#   pnpm deploy                           # sube dist/ a S3 + purga CDN
#
# Requisitos: AWS CLI configurado con credenciales (las pone Jonathan).
# NOTA: el build falla si noticias.json y los assets no están públicos en S3
#       (el sitio depende siempre de S3, sin fallback).

set -euo pipefail

cd "$(dirname "$0")/.."

# --- Cargar configuración ---
if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
else
  echo "✗ Falta apps/web/.env.deploy (copia .env.deploy.example y complétalo)." >&2
  exit 1
fi

: "${S3_BUCKET:?Define S3_BUCKET en .env.deploy}"
: "${AWS_REGION:=us-east-2}"
: "${S3_PREFIX:=}"

DIST_DIR="dist"
if [ ! -d "$DIST_DIR" ]; then
  echo "✗ No existe dist/. Corre 'pnpm build' primero." >&2
  exit 1
fi

DEST="s3://${S3_BUCKET}"
[ -n "${S3_PREFIX}" ] && DEST="${DEST}/${S3_PREFIX#/}"

echo "→ Subiendo $DIST_DIR a $DEST (región $AWS_REGION)"

# 1) Assets con hash (immutables) → caché larga.
aws s3 sync "$DIST_DIR" "$DEST" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "*.html" \
  --exclude "*.xml" \
  --exclude "*.txt" \
  --cache-control "public,max-age=31536000,immutable"

# 2) HTML y archivos de índice → sin caché (para ver cambios al instante).
aws s3 sync "$DIST_DIR" "$DEST" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --include "*.xml" \
  --include "*.txt" \
  --cache-control "public,max-age=0,must-revalidate"

echo "✓ Subida a S3 completa."

# --- Purga de caché del CDN (según proveedor) ---
if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ] && [[ "${CLOUDFRONT_DISTRIBUTION_ID}" != PLACEHOLDER* ]]; then
  echo "→ Invalidando CloudFront ${CLOUDFRONT_DISTRIBUTION_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" >/dev/null
  echo "✓ Invalidación CloudFront enviada."
elif [ -n "${CLOUDFLARE_ZONE_ID:-}" ] && [[ "${CLOUDFLARE_ZONE_ID}" != PLACEHOLDER* ]]; then
  echo "→ Purga de caché Cloudflare (zona ${CLOUDFLARE_ZONE_ID})"
  curl -s -X POST \
    "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}' >/dev/null
  echo "✓ Purga Cloudflare enviada."
else
  echo "⚠ Sin CDN configurado (placeholders). Configura CloudFront o Cloudflare en .env.deploy para purgar caché."
fi

echo "✓ Deploy terminado."
