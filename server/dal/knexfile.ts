/**
 * This doubles as the conventional knexfile that provides config for 
 * knex's CLI, and a module that export a knex instance
 * corresponding to the environment
 */

import knex, { Knex } from 'knex'

const production = {
  client: 'postgresql',
  connection: {
    host:     'db',
    database: 'postgres',
    user:     'postgres',
    password: 'postgres'
  } as Knex.PgConnectionConfig
}

const byEnv = {
  production,
  development: {
    ...production,
    connection: {
      ...production.connection,
      host: '127.0.0.1'  
    }
  },
  test: {
    ...production,
    connection: {
      ...production.connection,
      database: 'test'
    },
    seeds: { directory: 'dummy' },
  }
} satisfies NodeJS.Dict<Knex.Config>

import config from '../config'
const { client, connection } = byEnv[config.env]

import env from './config'
for (const key in env) {
  const value = env[key]
  // overiding if environment variable exists
  if (value) connection[key] = value
}

const createConnector = () => {
  const db = { client, connection }
  let instance: Knex

  return Object.assign(
    () => instance || (instance = knex(db)),
    db
  )
}

export const connect = createConnector()

export default byEnv
