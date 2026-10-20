#!/bin/zsh
set -eu
cd -- "${0:A:h}"
if command -v node >/dev/null 2>&1; then
  FIELDWORK_NODE="$(command -v node)"
elif [[ -x "$HOME/.local/bin/node" ]]; then
  FIELDWORK_NODE="$HOME/.local/bin/node"
else
  print 'Install Node.js 20.11 or newer from https://nodejs.org, then open this launcher again.'
  read '?Press Return to close.'
  exit 1
fi
print 'Keep this Terminal window open while learning. Open the URL printed below in your browser.'
print 'Press Control-C here to stop the local portal.'
exec "$FIELDWORK_NODE" scripts/serve.mjs --open
