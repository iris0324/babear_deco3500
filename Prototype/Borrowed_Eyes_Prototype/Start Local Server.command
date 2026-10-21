#!/bin/zsh
set -e
borrowed_eyes_root="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$borrowed_eyes_root"
if command -v node >/dev/null 2>&1; then
  borrowed_eyes_node="$(command -v node)"
else
  borrowed_eyes_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$borrowed_eyes_node" ]]; then
  echo 'Node.js 22 or later is required.'
  read '?Press Enter to close'
  exit 1
fi
echo 'Open in your browser: http://127.0.0.1:8787'
echo 'Stop server: Control+C'
"$borrowed_eyes_node" server/main.mjs
