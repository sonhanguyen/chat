import Messages from '../entities/Messages'
// @ts-ignore knex cli complains here for whatever reason
import { Message } from 'zapatos/schema'
import Users from '../entities/Users'
import { type Knex } from 'knex';
import { randPhrase, randNumber, randRecentDate, randBoolean } from '@ngneat/falso'

export async function seed(knex: Knex): Promise<void> {
  const users = new Users(knex)
  const [ sender, receiver ] = (await users.all(2)).map(it => it.id)

  await knex(Messages.TABLE).del()

  const start = randRecentDate().getTime()
  const now = Date.now()
  const length = 100
  const space = (now - start) / length

  const messages = Array
    .from({ length })
    .map<Message.Insertable>((_, index) => {
      const msg = randBoolean()
        ? { sender: receiver, receiver: sender }
        : { sender, receiver }

      return { ...msg,
        utc_time: new Date(
          space * index + randNumber(
            { min: -space, max: space }
          )
        ),
        body: randPhrase()
      }
    })

  await knex(Messages.TABLE).insert(messages)
}
