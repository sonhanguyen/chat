
// @ts-ignore knex cli complains here for whatever reason
import { User } from 'zapatos/schema'
import { db as database } from '../knexfile'

const User = ({ password, ...user }: User.Selectable) =>
  user as Omit<User.Selectable, 'password'>

export type User = ReturnType<typeof User>

export default class Users {
  static TABLE: User.Table = 'User'

  constructor(
    private db = database()
  ) { }

  async all(limit?: number) {
    const query = this.db(Users.TABLE).select()
    if (Number.isInteger(limit)) query.limit(limit)
    
    return (await query).map(User)
  }

  async byId(id: string) {
    const { rows: [ user ] } = await this.db.raw(`
      SELECT * FROM "${Users.TABLE}" WHERE id = ?
    `, [ id ])

    if (user) return User(user)
  }

  async byCredential(username: string, password: string) {
    const { rows: [ user ] } = await this.db.raw(`
      SELECT *, (password = crypt(:password, password)) AS match
      FROM "${Users.TABLE}"
      WHERE username = :username
    `, { username, password })

    if (user?.match) {
      delete user.match
      return User(user)
    }
  }

  async create(
    name: string,
    username: string,
    password: string
  ) {
    const created = await this.db.raw(`
      INSERT INTO "${Users.TABLE}" (
        name, username, password
      )
      VALUES (
        ?, ?, crypt(?, gen_salt('bf'))
      )
      RETURNING *
    `, [ name, username, password ])

    return User(created)
  }
}