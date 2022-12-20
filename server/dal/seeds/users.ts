import { type Knex } from 'knex'
import Users from '../entities/Users'

export async function seed(knex: Knex) {
  await knex('User').del()
  const users = new Users(knex)
  await users.create('Harry', 'sonha', ' ')
  await users.create('Ha', 'harry', ' ')
}
