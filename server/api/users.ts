import { users } from '../services'
import { Router } from 'express'

import { type User as UserWithoutSatus } from '../dal/entities/Users' 
import server from '..'

export type User = UserWithoutSatus & {
  connected?: boolean
}

export default Router()
  .get('/register', async (req, res) => {
    const { username, name, password } = req.body
    const user = await users.create(name, username, password)
    res.json(user)
  })
  .get('/me', async (req, res) => res.json(req.user))
  .get('/', async (_, res) => {
    const all = await users.all()

    // get the broadcasting rooms for each users
    const { rooms = new Map<string, Set<string>>() } =
      server.socket?.io.sockets.adapter || {}
  
    all.forEach((user: User) => {
      // user is connected if there is at least one socket.io client
      user.connected = Boolean(rooms.get(user.id)?.size)
    })
    res.json(all)
  })
