import { db as database } from '../knexfile'
// @ts-ignore knex cli complains here for whatever reason
import { Message } from 'zapatos/schema'

function Message({ utc_time, ...msg }: Message.Selectable) {
  return { ...msg, timestamp: utc_time.getTime() }
}

export type Message = ReturnType<typeof Message>
export type Paginated<T = Message> = { hasMore: boolean, results: T[] }

export default class Messages {
  static TABLE = 'Message' satisfies Message.Table

  constructor(
    private db = database()
  ) { }

  async byParticipants({ users, limit, before }: {
    users: [string, string],
    before?: number,
    limit?: number
  }): Promise<Paginated> {
    const participants = 'sender = ? AND receiver = ?'
    const query = this.db(Messages.TABLE)
      .select()
      .where(_ => _
        .whereRaw(participants, users)
        .orWhereRaw(participants, [...users].reverse())
      )
      .orderBy('utc_time' satisfies Message.Column, 'desc')
    
    if (limit) {
      limit++ // query one more to determine if this is the last page
      query.limit(limit)
    }
    if (before) query.andWhereRaw("utc_time < to_timestamp(?)", [ before / 1000 ])

    const results = (await query)
      .map(Message)
      .reverse()
    
    if (results.length == limit) {
      var hasMore = true
      results.shift()
    } else hasMore = false

    return { hasMore, results }
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