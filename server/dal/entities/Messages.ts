import { db as database } from '../knexfile'
// @ts-ignore knex cli complains here for whatever reason
import { Message } from 'zapatos/schema'

const Message = ({ utc_time, ...msg }: Message.Selectable) => ({
  ...msg, timestamp: utc_time.getTime()
})

export type Message = ReturnType<typeof Message>

export default class Messages {
  static TABLE: Message.Table = 'Message'

  constructor(
    private db = database()
  ) { }

  async byParticipants(from: string, to: string) {
    const { rows } = await this.db.raw(`
      SELECT * FROM "${Messages.TABLE}"
      WHERE sender = :from AND receiver = :to
         OR sender = :to AND receiver = :from
    `, { from, to })

    return rows.map(Message)
  }

  async create(
    body: string,
    sender: string,
    receiver: string
  ) {
    const { rows: [ created ] } = await this.db.raw(`
      INSERT INTO "${Messages.TABLE}" (
        body, sender, receiver
      ) VALUES (?, ?, ?)
      RETURNING *
    `, [ body, sender, receiver ])

    return Message(created)
  }
}