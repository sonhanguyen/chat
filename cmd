#!/bin/bash
PATH=./node_modules/.bin:$PATH

dev() {
  # automatically restart server when code changes
  npx ts-node-dev -T --respawn server
}

run() {
  ts-node -T server
}

start() {
  bash -c 'cd server/dal; ./cmd init'

  run
}

--help() {
  echo "commands:"
  compgen -A function | cat -n
}

"$@"