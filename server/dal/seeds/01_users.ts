import { randMovieCharacter } from '@ngneat/falso'
import { type Knex } from 'knex'
import Users from '../entities/Users'

export async function seed(knex: Knex) {
  await knex(Users.TABLE).del()

  const users = new Users(knex)
  
  await Promise.all(Array
    .from({ length: 10 })
    .map((_, index) => [
      randMovieCharacter(), 
      'sonha' + index, ' '
    ] as const)
    .map(user => users.create(...user))
  )
}
