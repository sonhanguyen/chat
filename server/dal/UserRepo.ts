import { type Knex } from 'knex'

// @ts-ignore knex cli complains here for whatever reason
import { User } from 'zapatos/schema'

const SelectedUser = ({ password, ...user }: User.Selectable) =>
  user as Omit<User.Selectable, 'password'>

export type User = ReturnType<typeof SelectedUser>

export default class UserRepo {
  static TABLE = 'User'

  constructor(
    private db: Knex = require('./knexfile')
  ) { }

  async all() {
    const { rows } = await this.db.raw(`SELECT * FROM "${UserRepo.TABLE}"`)
    
    return rows.map(SelectedUser)
  }

  async byId(id: string) {
    const { rows: [ user ] } = await this.db.raw(`
      SELECT * FROM "${UserRepo.TABLE}" WHERE id = ?
    `, [ id ])

    if (user) return SelectedUser(user)
  }

  async byCredential(username: string, password: string) {
    const { rows: [ user ] } = await this.db.raw(`
      SELECT *, (password = crypt(:password, password)) AS match
      FROM "${UserRepo.TABLE}"
      WHERE username = :username
    `, { username, password })

    if (user?.match) {
      delete user.match
      return SelectedUser(user)
    }
  }

  async create(
    name: string,
    username: string,
    password: string
  ) {
    const created = await this.db.raw(`
      INSERT INTO "${UserRepo.TABLE}" (
        name, username, password
      )
      VALUES (
        ?, ?, crypt(?, gen_salt('bf'))
      )
      RETURNING *
    `, [ name, username, password ])

    return SelectedUser(created)
  }
}