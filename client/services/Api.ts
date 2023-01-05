import HttpService from './HttpService'
import UserStore from './UserStore'

import type { Message, Paginated } from '../../server/api/messages'
export type { Message, Paginated }

export type AuthData = {
  token: string
  id: string
  name: string
}

export default class Api {
  readonly users: UserStore

  constructor(private config: Pick<UserStore, 'onAuthorized'> & {
    saveAuthData?: (_: AuthData) => void,
    http: HttpService
  }) {
    this.users = new UserStore(config.http, config.onAuthorized)
  }

  login = async (cred: { username: string, password: string }) => {
    const authData = await this.config.http.fetch<AuthData>(
      '/api/login', { 
        method: 'POST',
        body: cred
      }
    )

    this.config.saveAuthData?.(authData)
  }

  loadChatHistory = (userId: string, limit = 10, timestamp?: number) => {
    const query = new URLSearchParams
    query.append('withUser', userId)
    query.append('limit', String(limit))

    if (timestamp) query.append('before', String(timestamp))

    return this.config.http.fetch<Paginated>('/api/messages/conversation?' + query)
  }

  send = (to: string, body: string) =>
    this.config.http.fetch('/api/messages', {
      body: { to, body }, 
      method: 'POST'
    })

  register = (name: string, username: string, password: string) =>
    this.config.http.fetch('/api/register', {
      body: { name, username, password }, 
      method: 'POST'
    })
}

import io, { Socket } from 'socket.io-client'
import { type Payload } from '../../server/services/PushServer'

export class PubSub {
  private socket!: Socket

  constructor(
    private getAuthToken: () => string | void
  ) {}

  connect = (
    { baseUrl = process.env.BASE_URL,
      ...opts }: Extract<Parameters<typeof io>[number], object> & {
      baseUrl?: string
    } = {}
  ) => new Promise<void>((resolve, reject) => {
    opts.extraHeaders = {
      Authorization: this.getAuthToken() as string
    }

    if (baseUrl) {
      if (!baseUrl.includes('://')) baseUrl = 'http://' + baseUrl
      this.socket = io(baseUrl, opts)
    } else this.socket = io(opts)
    
    this.socket
      .on('connect_error', reject)
      .on('connect', resolve)
  })

  disconnect = () => {
    this.socket.disconnect()
  }

  on<T extends keyof Payload>(event: T, handler: (_: Payload[T]) => void): () => void {
    this.socket.on(event, handler as any)
    
    return () => this.socket.removeListener(event, handler as any)
  }
}