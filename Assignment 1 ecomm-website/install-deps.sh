#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing dependencies for all workspaces..."
cd "$(dirname "$0")"

# Prefer clean install if lockfile exists
if [ -f package-lock.json ]; then
  npm ci --workspaces --install-strategy=nested --no-fund --no-audit \
    || npm install --workspaces --install-strategy=nested --no-fund --no-audit
else
  npm install --workspaces --install-strategy=nested --no-fund --no-audit
fi

echo "📦 Ensuring per-package node_modules are populated..."
# Run a no-op install in each workspace to ensure local node_modules get created
npm install --workspace client --install-strategy=nested --no-fund --no-audit || true
npm install --workspace server --install-strategy=nested --no-fund --no-audit || true

echo "✅ Dependencies installed"