import config from '../config'
import Messages from '../dal/entities/Messages'
import Users from '../dal/entities/Users'
import { makeMiddleware as makeAuthenticator } from './auth'

export const users = new Users
export const messages = new Messages

export const middlewares = {
  auth: makeAuthenticator(
    (id: string) => users.byId(id),
    config.jwtKey
  )
}
