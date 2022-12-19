import HttpService from './HttpService';

export type AuthData = {
  token: string
  name: string
}

export type Message = {
  _id: string
  to: string
  from: string
  body: string
  date: number
}

export default class Api {
  constructor(
    readonly http: HttpService,
    private saveAuthData: (_: AuthData) => void
  ) {}

  login = async (cred: { username: string, password: string }) => {
    const authData = await this.http.fetch<AuthData>(
      '/api/login',
      { 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
        method: 'POST'
      }
    )

    Object.assign(this, { authData })
    this.saveAuthData(authData)
  }

  loadChatHistory = async (userId: string, timestamp?: string, limit = 10) => {
    return this.http.fetch<Message[]>(`/api/messages/conversations/query?userId=${userId}`)
  }

  send = async (to: string, body: string) => {
    return this.http.fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ to, body }), 
    })
  }
}

import io, { Socket } from 'socket.io-client'

type Payload = {
  message: Message
  users: any
}

export class WSClient {
  private socket!: Socket

  constructor(
    private getAuthToken: () => string | void,
    private endpoint = process.env.NEXT_PUBLIC_REST_URL
  ) {

  }

  connect() {
    this.socket = io(this.endpoint as string, {
      extraHeaders: {
        Authorization: this.getAuthToken() as string
      }
    })
  }

  on<T extends keyof Payload>(event: T, handler: (_: Payload[T]) => void): () => void {
    this.socket.on(event, handler as any)
    
    return () => this.socket.removeListener(event, handler as any)
  }
}