import { type Knex } from 'knex'
import UserRepo from '../UserRepo'

export async function seed(knex: Knex) {
  await knex('User').del()
  const users = new UserRepo(knex)
  await users.create('Harry', 'sonha', ' ')
  await users.create('Ha', 'harry', ' ')
}
