#!/usr/bin/env bash
set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "dev" ]; then
  echo "❌ REFUSING TO START DEV MODE"
  echo "   You are on branch '$CURRENT_BRANCH'"
  echo "   Switch to 'dev' first:"
  echo
  echo "     git checkout dev"
  echo
  exit 1
fi

echo "🔧 Switching to DEV mode..."

# Stop prod stack if running
echo "⛔ Stopping PROD containers (if any)..."
cd ~/website/docker/website || exit 1
docker compose down || true

cd ~/website/docker/nginx || exit 1
docker compose down || true

# Start dev stack
echo "▶️ Starting DEV containers..."
cd ~/website/docker/website || exit 1
docker compose -f docker-compose.dev.yml up -d

echo "✅ DEV mode active"
echo "🌐 http://192.168.0.15:3000"
