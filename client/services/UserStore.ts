import { type User } from '../../server/api/users'
import { observable } from 'mobx'
import { AuthData } from './Api'
import HttpService from './HttpService'
export type { User }

const byStatus = (user: User, next: User) =>
  Number(next.connected) - Number(user.connected)

export default class UserStore {
  auth?: AuthData
  readonly all = observable.array<User>()

  constructor(
    readonly http: HttpService,
    readonly onAuthorized?: (_: AuthData) => void 
  ) {}

  updateStatus = (user: User) => {
    const { all } = this
    const existing = all.find(({ id }) => id == user.id)
    if (existing) Object.assign(existing, user)
    else all.push(user)

    all.sort(byStatus)
  }

  byId = (id: string) => this.all.find(their => id == their.id)
  
  myProfile = async() => {
    this.onAuthorized?.(
      this.auth = await this.http.fetch<AuthData>('/api/users/me')
    )

    return this.auth
  }

  loadFriends = async() => this.all
    .replace(await this.http.fetch<User[]>('/api/users'))
    .sort(byStatus)
}
