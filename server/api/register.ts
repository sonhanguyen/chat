import { users } from '../services'
import { Router } from 'express'

export default Router()
  .post('/', async (req, res) => {
    const { username, name, password } = req.body
    try {
      const user = await users.create(name, username, password)
      res.json(user)
    } catch (error) {
      const { message, detail, constraint, routine } = error as NodeJS.Dict<string>
      // code: '23505',
      // detail: 'Key (username)=(sonha) already exists.',
      // table: 'User',
      // constraint: 'User_username_key',
      // routine: '_bt_check_unique'
      if (constraint?.includes('username')
        && routine == '_bt_check_unique') {
      }

      res.status(400)
      res.json(detail || message)
    }
  })