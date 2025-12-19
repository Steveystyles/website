#!/usr/bin/env bash
set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ REFUSING TO START PROD MODE"
  echo "   You are on branch '$CURRENT_BRANCH'"
  echo "   Switch to 'main' first:"
  echo
  echo "     git checkout main"
  echo
  exit 1
fi

echo "🚀 Switching to PROD mode..."

# Stop dev stack if running
echo "⛔ Stopping DEV containers (if any)..."
cd ~/website/docker/website || exit 1
docker compose -f docker-compose.dev.yml down || true

# Start prod website
echo "▶️ Starting PROD website..."
docker compose up -d

# Start nginx
echo "▶️ Starting nginx..."
cd ~/website/docker/nginx || exit 1
docker compose up -d

echo "✅ PROD mode active"
echo "🌍 https://fultonsmovies.co.uk"
