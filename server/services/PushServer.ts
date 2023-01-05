import { RequestHandler } from 'express'
import http from 'http'
import SocketIO from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { Handshake } from 'socket.io/dist/socket'
import { Message } from '../api/messages'
import { User } from '../api/users'

export type Payload = {
  message: Message
  user: User
}

export class PushServer {
  readonly pubsub?: SocketIO.Server
  readonly connected = new Set<User['id']>

  start(options: Partial<SocketIO.ServerOptions> & {
    server: http.Server
  }, ...middlewares: {
    (_: SocketIO.Socket, next: (_?: ExtendedError) => void): void 
  }[]) {
    (this.pubsub as SocketIO.Server) = new SocketIO.Server(options.server, {
      cors: { origin: '*' }
    })

    middlewares.forEach(middleware =>
      this.pubsub?.use(middleware)
    )

    this.pubsub?.on('connection', socket => {
      const { user } = socket.handshake as Handshake & { 
        user: User
      }

      socket.broadcast.emit('user', { ...user, connected: true })

      const { id } = user
      this.connected.add(id)

      // put all sockets from the same user into the same broadcasting room
      socket.join(id)
      
      socket.on('disconnect', () => {
        const connections = this.pubsub?.sockets.adapter.rooms.get(id)
        if (!connections?.size) {
          this.pubsub?.emit('user', { ...user, connected: false })
          this.connected.delete(id)
        }
      })
    })
  }

  emit<T extends keyof Payload>(
    room: User['id'],
    event: T,
    payload: Payload[T]
  ) {
    return this.pubsub?.in(room).emit(event, payload)
  }

  stop() {
    this.pubsub?.close()
    this.pubsub?.sockets.disconnectSockets()
  }
}

export const makeMiddleware = (middleware: RequestHandler<any, any>) =>
({ request, handshake }: any, next: (err?: any) => void) =>
  middleware(handshake || request, {} as any, next as any)

export default PushServer