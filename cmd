#!/bin/bash
PATH=./node_modules/.bin:$PATH

dev() {
  # auto matically restart server when code changes
  npx ts-node-dev -T --respawn server
}

run() {
  ts-node -T server
}

--help() {
  echo "commands:"
  compgen -A function | cat -n
}

"$@"