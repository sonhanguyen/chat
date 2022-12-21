import { Express, Handler } from 'express'

import login from './login'
import messages from './messages'
import users from './users'

export default function attach(app: Express, authenticated: Handler) {
  app.use('/api/login', login)
  app.use('/api/messages', authenticated, messages)
  app.use('/api/users', authenticated, users)
}