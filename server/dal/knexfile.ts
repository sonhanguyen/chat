/**
 * This doubles as the conventional knexfile that provides config for 
 * knex's CLI, and a module that export a knex instance
 * corresponding to the environment
 */
import config from '../config'
import knex, { type Knex } from 'knex'

const production = {
  client: 'postgresql',
  connection: {
    host:     'db',
    database: 'postgres',
    user:     'postgres',
    password: 'postgres'
  }
}

const byEnv = {
  development: production,
  production,
  test: {
    ...production,
    connection: {
      ...production.connection,
      host: 'localhost'
    }
  }
}

const { client, connection }: typeof production = byEnv[config.env]

import env from './config'
for (const key in env) {
  const value = env[key]
  // overiding if environment variable exists
  if (value) connection[key] = value
}

export const db = Object.assign(
  () => knex({ client, connection }),
  connection
)

export default byEnv

