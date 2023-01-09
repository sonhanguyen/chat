#!/bin/bash
PATH=./node_modules/.bin:$PATH
node="node -r ts-node/register/transpile-only"

e2e() {
  set -a
  source .env
  NODE_ENV=test
  
  PORT=$((PORT + 1))
  BASE_URL=127.0.0.1:$PORT
  PACTUM_REQUEST_BASE_URL=http://$BASE_URL
  # DEBUG=socket.io-client
  set +a

  bash -c 'cd server/dal && ./cmd init --create-db' || exit $?
  
  run --fork "wait-for-it $BASE_URL && $node --test `
    find . ${@:--name *.spec.ts} ! -path '*node_modules*'`
  "
}

run() {
  quit() {
    rv=${1:-$?}
    kill $server
    exit $rv
  }

  if [[ $1 == --fork ]]; then cmd=$2
  else
    $node server
    quit
  fi

  trap quit INT TERM EXIT
  $node server&
  server=$!
  bash -c "$cmd"
}

start() {
  NODE_ENV=production bash -c 'cd server/dal && ./cmd init'

  run
}

--local() {
  set -a
  source .env
  DB_HOST=127.0.0.1 # can't use "localhost" from node 17: github.com/nodejs/node/pull/39987
  set +a

  if [[ $@ ]]; then docker-compose up -d db
  else
    echo ensure db is available at $DB_HOST
    echo then run any command with DB_HOST=$DB_HOST

    --help
  fi

  if [[ `type -t $1` == function ]]; then $@
  else bash -c "cd server/dal && ./cmd $@"; fi
}

--help() {
  echo "commands:"
  compgen -A function | cat -n
}

${@:-'--help'}
