import { db as database } from '../knexfile'
import { Message } from 'zapatos/schema'

const Message = ({ utc_time, ...msg }: Message.Selectable) => ({ ...msg, timestamp: new Date(utc_time)})

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
}