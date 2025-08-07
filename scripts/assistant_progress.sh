#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-}"
if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"message\"" >&2
  exit 1
fi

DATE=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
{
  echo ""
  echo "### $DATE"
  echo "- $MESSAGE"
} >> /workspace/docs/ASSISTANT_PROGRESS.md

git add /workspace/docs/ASSISTANT_PROGRESS.md
# Commit may be a no-op if nothing changed; suppress error
(git commit -m "chore(progress): $MESSAGE" >/dev/null 2>&1) || true

echo "Logged: $DATE - $MESSAGE"
