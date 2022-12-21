import Messages from '../entities/Messages'
// @ts-ignore knex cli complains here for whatever reason
import { Message } from 'zapatos/schema'
import Users from '../entities/Users'
import { type Knex } from 'knex';
import { randPhrase, randNumber, randRecentDate, randBoolean, rand } from '@ngneat/falso'

export async function seed(knex: Knex): Promise<void> {
  const users = (await new Users(knex).all()).map(it => it.id)

  await knex(Messages.TABLE).del()

  const start = randRecentDate().getTime()
  const now = Date.now()

  const messages = Array
    .from({ length: 500 })
    .map<Message.Insertable>(_ => {
      const sender = rand(users)
      const receiver = rand(users.filter(it => it != sender))
  
      return {
        utc_time: new Date(randNumber({ min: start, max: now })),
        body: randPhrase(),
        receiver,
        sender
      }
    })

  await knex(Messages.TABLE).insert(messages)
}
