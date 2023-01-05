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
  
    all.forEach((user: User) =>
      user.connected = server.push?.connected.has(user.id)
    )
    res.json(all)
  })
