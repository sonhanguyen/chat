import { UserEntity } from './Database'

const SelectedUser = ({ password, ...user }: UserEntity) =>
  user as Omit<Required<UserEntity>, 'password'>

export default class UserRepo {
  static TABLE = 'User'

  constructor(
    private db = require('knex')(require('./db.json'))
  ) { }

  async all() {
    return (await this.db.raw(`SELECT * FROM "${UserRepo.TABLE}"`))
      .map(SelectedUser)
  }

  async byCredential(username: string, password: string) {
    const [ user ] = await this.db.raw(`
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