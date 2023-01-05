import { Handler, Router } from 'express'

import register from './register'
import login from './login'

import messages from './messages'
import users from './users'

export default (authenticated: Handler) => Router()
  .use('/register', register)
  .use('/login', login)
  .use('/messages', authenticated, messages)
  .use('/users', authenticated, users)
