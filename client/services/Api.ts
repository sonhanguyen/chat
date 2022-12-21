import HttpService from './HttpService'
import UserStore from './UserStore'

import { type Message } from '../../server/api/messages'
export type { Message }

export type AuthData = {
  token: string
  id: string
  name: string
}

export default class Api {
  readonly users: UserStore

  constructor(private config: Pick<UserStore, 'onAuthorized'> & {
    http: HttpService,
    saveAuthData: (_: AuthData) => void
  }) {
    this.users = new UserStore(config.http, config.onAuthorized)
  }

  login = async (cred: { username: string, password: string }) => {
    const authData = await this.config.http.fetch<AuthData>(
      '/api/login',
      { 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
        method: 'POST'
      }
    )

    this.config.saveAuthData(authData)
  }

  loadChatHistory = async (userId: string, timestamp?: string, limit = 10) => {
    return this.config.http.fetch<Message[]>('/api/messages/' + userId)
  }

  send = async (to: string, body: string) => {
    return this.config.http.fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ to, body }), 
    })
  }
}

import io, { Socket } from 'socket.io-client'
import { type Payload } from '../../server/services/WSServer';

export class WSClient {
  private socket!: Socket

  constructor(
    private getAuthToken: () => string | void,
  ) {}

  connect() {
    this.socket = io({
      extraHeaders: {
        Authorization: this.getAuthToken() as string
      }
    })
  }

  on<T extends keyof Payload>(event: T, handler: (_: Payload[T]) => void): () => void {
    this.socket.on(event, console.log as any)
    this.socket.on(event, handler as any)
    
    return () => this.socket.removeListener(event, handler as any)
  }
}