
import { Knex } from 'knex'
import { User } from 'zapatos/schema'

const User = ({ password, ...user }: User.Selectable) =>
  user as Omit<User.Selectable, 'password'>

export type User = ReturnType<typeof User>

export default class Users {
  static TABLE = 'User' satisfies User.Table

  constructor(
    private db: () => Knex
  ) { }

  async all() {
    const users = await this.db()(Users.TABLE).select()

    return users.map(User)
  }

  async byId(id: string) {
    const { rows: [ user ] } = await this.db().raw(`
      SELECT * FROM "${Users.TABLE}" WHERE id = ?
    `, [ id ])

    if (user) return User(user)
  }

  async byCredential(username: string, password: string) {
    const { rows: [ user ] } = await this.db().raw(`
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
    const { rows: [ created ] } = await this.db().raw(`
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