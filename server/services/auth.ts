import { type RequestHandler } from 'express'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { type User } from '../dal/UserRepo'
import passport from 'passport'

export const makeMidddware = (
  userById: (id: string) => Promise<User | undefined>,
  secretOrKey: string
): RequestHandler => {
  passport.use(
    new Strategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey
    }, async ({ id }, done) => {
      try {
        const user = await userById(id)
        return done(null, user)
      } catch (err) {
        done(err)
      }
    })
  )

  return passport.initialize()
}