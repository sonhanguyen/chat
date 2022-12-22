
import express from 'express'
import next from 'next'
import cors from 'cors'
import config from './config'
import PushServer, { makeMidleware } from './services/PushServer'
import { middlewares } from './services'
import api from './api'

class Server {
  readonly socket?: PushServer
  
  async start(
    port = config.webServerPort,
    env = config.env
  ) {
    const staticServer = next({ dev: env != 'production' })

    const handle = staticServer.getRequestHandler()
    const app = express()  
    const bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())

    // attach api routes
    api(app, middlewares.auth)

    // fall back to nextjs routes
    app.all("*", (req: any, res: any) => handle(req, res))

    await staticServer.prepare()

    await new Promise<void>((resolve, reject) => {
      const httpServer = app.listen(port, (err?: any) => {
        if (err) reject(err)
        else resolve()
      })

      ;(this.socket as PushServer) = new PushServer(
        httpServer, makeMidleware(middlewares.auth)
      )
    })

    return { port, env }
  }
}

const server = new Server

server
  .start()
  .then(({ port, env }) => {
    console.log(`> Ready on localhost:${port} - env ${env}`)
  }, err => {
    console.error(err)
    process.exit(1)
  })

export default server
