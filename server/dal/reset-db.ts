import { Client, ClientConfig } from 'pg'
import { connect } from './knexfile'

export default async function resetDb(
  config: ClientConfig & { drop?: boolean } = {}
) {
  let { database, drop = true, ...options } = { ...connect.connection as ClientConfig, ...config }
  const client = new Client(options)

  await client.connect()
  const DROP = 'DROP DATABASE IF EXISTS ' + database
  console.log(DROP)
  await client.query(DROP)
  if (drop) database = undefined; else {
    console.log(`Re-creating database "${database}"..`)
    await client.query('CREATE DATABASE ' + database)
  }

  await client.end()

  return Object.assign(client, { database }) 
}

if (require.main === module) {
  const [ flag ] = process.argv.slice(2)

  resetDb({ drop: '-d --drop'.includes(flag) }).catch(err => {
    console.error(err)
    process.exit(1)
  })
}