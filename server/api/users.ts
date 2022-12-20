import { users } from '../services'
import { Router } from 'express'

export default Router()
  .get('/me', async (req, res) => res.json(req.user))
  .get('/', async (_, res) => {
    const all = await users.all()

    res.json(all)
  })
