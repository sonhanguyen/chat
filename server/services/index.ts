import config from '../config'
import { makeMiddleware } from './auth'
export { PushServer, makeMiddleware as socketIoMiddleware } from './PushServer'

import { users, messages } from '../dal/entities'

export { users, messages }

export const middlewares = {
  auth: makeMiddleware(
    (id: string) => users.byId(id),
    config.jwtKey
  )
}
