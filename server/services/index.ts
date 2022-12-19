import config from '../config'
import UserRepo from '../dal/UserRepo'
import { makeMidddware as makeAuthMiddleware } from './auth'

export const userRepo = new UserRepo

const services = {
  userRepo
}

export default services
export type Services = typeof services

export const middlewares = {
  auth: makeAuthMiddleware(
    (id: string) => userRepo.byId(id),
    config.jwtKey
  )
}