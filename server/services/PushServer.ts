import { RequestHandler } from 'express'
import http from 'http'
import SocketIO, { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { Handshake } from 'socket.io/dist/socket'
import { Message } from '../api/messages'
import { User } from '../api/users'

export type Payload = {
  message: Message
  user: User
}

export class PushServer {
  readonly io: SocketIO.Server

  constructor(
    server: http.Server, 
    ...middlewares: {
      (_: Socket, next: (_?: ExtendedError) => void): void 
    }[]
  ) {
    this.io = new SocketIO.Server(server, {
      cors: { origin: '*' }
    })

    middlewares.forEach(middleware =>
      this.io.use(middleware)
    )

    this.io.on('connection', socket => {
      const { user } = socket.handshake as Handshake & { 
        user: User
      }

      socket.broadcast.emit('user', { ...user, connected: true })

      // put all sockets from the same user into the same broadcasting room
      socket.join(user.id)

      socket.on('disconnect', () => {
        const connections = this.io.sockets.adapter.rooms.get(user.id)
        if (!connections?.size) this.io.emit('user', { ...user, connected: false })
      })
    })
  }

  emit<T extends keyof Payload>(
    room: User['id'],
    event: T,
    payload: Payload[T]
  ) {
    return this.io.in(room).emit(event, payload)
  }
}

export const makeMidleware = (middleware: RequestHandler<any, any>) =>
({ request, handshake }: any, next: (err?: any) => void) =>
  middleware(handshake || request, {} as any, next as any)

export default PushServer