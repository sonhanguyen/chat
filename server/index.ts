
import express from 'express'
import type { Server as HTTPServer } from 'node:http'
import next from 'next'
import cors from 'cors'
import config from './config'
import { PushServer, socketIoMiddleware } from './services'
import { middlewares } from './services'
import api from './api'

export class Server {
  readonly push?: PushServer
  readonly running?: HTTPServer

  async start(
    port = config.wwwPort,
    env = config.env
  ) {
    const staticServer = next({ dev: env != 'production' })

    const handle = staticServer.getRequestHandler()
    const app = express()  
    const bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())

    app.use('/api', api(middlewares.auth))

    // fallback to nextjs routes
    app.all("*", (req: any, res: any) => handle(req, res))

    await staticServer.prepare()

    const running = await new Promise<HTTPServer>((resolve, reject) => {
      const http = app.listen(port, (err?: any) => {
        if (err) reject(err)
        else resolve(http)
      })
    })

    const push = new PushServer
    push.start({ server: running }, socketIoMiddleware(middlewares.auth))

    Object.assign(this, {
      running,
      push
    })

    return {
      port,
      env
    }
  }

  stop = async () => {
    this.push?.stop()
    await new Promise<void>((resolve, reject) =>
      this.running?.close(error => error ? reject(error) : resolve())
    )
    this.running?.closeAllConnections()
  }
}

const server = new Server

if (require.main === module) {
  [ 'uncaughtException', 'SIGTERM', 'SIGINT', // ctrl+c
    'SIGUSR1', 'SIGUSR2' // "kill pid" (for example: nodemon restart)
  ].forEach(
    evt => process.once(evt, async error => {
      await server.stop().catch()
      process.exit()
    })
  )

  server
    .start()
    .then(({ port, env }) => {
      console.log(`> Ready on localhost:${port} - env ${env}`)
    }, err => {
      console.error(err)
      process.exit(1)
    })
}

export default server
