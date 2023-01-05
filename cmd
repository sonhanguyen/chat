#!/bin/bash
PATH=./node_modules/.bin:$PATH

test() {
  set -a
  source .env
  NODE_ENV=test
  
  PORT=$((PORT + 1))
  BASE_URL=127.0.0.1:$PORT
  PACTUM_REQUEST_BASE_URL=http://$BASE_URL
  set +a

  bash -c 'cd server/dal && ./cmd init --create-db' || exit 1
  
  run --fork "
    wait-for-it $BASE_URL &&
    node $watch $tests -r ts-node/register/transpile-only --test `
      find . ${@:--name *.spec.ts} ! -path '*node_modules*'`
  "
}

run() {
  server="node $watch -r ts-node/register/transpile-only server"

  [[ $watch ]] && echo starting server in watch mode..
  
  [[ $1 == --fork ]] && cmd=${@:2}

  clean() {
    kill $server
    exit
  }

  echo $server

  if [[ $cmd ]]; then
    $server&
    server=$!
    trap clean INT TERM EXIT
    
    bash -c "$cmd"
  else $server
  fi
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

for arg in "$@"; do shift
  case "$arg"
  in "$skip")  skip=
  ;; -h|--help) --help
  ;; --fork)   cmd=$1; skip=$1
  ;; --watch) watch=--watch # note that --test and --watch only work together from nodejs 19
  ;; --name)  tests=--test-name-pattern=$1; skip=$1
  ;; *)         set -- $@ $arg
  esac
done

${@:-'--help'}
