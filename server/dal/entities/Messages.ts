import { db as database } from '../knexfile'
// @ts-ignore knex cli complains here for whatever reason
import { Message } from 'zapatos/schema'

const Message = ({ utc_time, ...msg }: Message.Selectable) => ({
  ...msg, timestamp: utc_time.getTime()
})

export type Message = ReturnType<typeof Message>
export type Paginated<T = Message> = { hasMore: boolean, messages: T[] }

export default class Messages {
  static TABLE = 'Message' satisfies Message.Table

  constructor(
    private db = database()
  ) { }

  async byParticipants(...params: [user: string, user: string, options?: {
    before?: number,
    limit?: number
  }]): Promise<Paginated> {
    const users = [ ...params ].reverse() as [ string, string ]
    const options = params.pop() as typeof params[number]
    if (options instanceof Object) {
      var { limit, before } = options
      users.shift()
    }

    const participants = 'sender = ? AND receiver = ?'
    const query = this.db(Messages.TABLE)
      .select()
      .where(db => db
        .whereRaw(participants, users)
        .orWhereRaw(participants, [...users].reverse())
      )
      .orderBy('utc_time' satisfies Message.Column)
    
    if (limit) {
      limit++ // query one more to determine if this is the last page
      query.limit(limit)
    }
    if (before) query.andWhereRaw('utc_time > to_timestamp(?)', [ before ])

    const messages = (await query).map(Message)
    if (messages.length == limit) {
      var hasMore = true
      messages.pop()
    } else hasMore = false

    return { hasMore, messages }
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