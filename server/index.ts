
import express, { type RequestHandler } from 'express'
import next from 'next'
import cors from 'cors'
import config from './config'

const bodyParser = require('body-parser')

const staticServer = next({ dev: config.env != 'production' })

const handle = staticServer.getRequestHandler()
const app = express()

import SocketIO from 'socket.io'
import { middlewares } from './services'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Assign socket object to every request
app.use(function (req, res, next) {
  Object.assign(req, { io })
  next()
})

import login from './api/login'
import messages from './api/messages'
import users from './api/users'

app.use('/api/login', login)
app.use('/api/messages', middlewares.auth, messages)
app.use('/api/users', middlewares.auth, users)
app.all("*", (req: any, res: any) => handle(req, res))

const port = Number() || 3000
let io: SocketIO.Server

const makeMidleware = (middleware: RequestHandler<any, any>) =>
  ({ request, handshake }: any, next: (err?: any) => void) =>
    middleware(handshake || request, {} as any, next as any)

staticServer
  .prepare()
  .then(() =>
    io = new SocketIO.Server(
      app.listen(port, (err?: any) => {
        if (err) throw err;
        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
      }), {
        cors: { origin: '*' }
      }
    ),//.use(makeMidleware(middlewares.auth)),
    (err: any)  => {
      console.error(err);
      process.exit(1);
    }
  )
