import { Strategy, ExtractJwt } from 'passport-jwt'
import { type User } from '../dal/entities/Users'
import passport from 'passport'

export const makeMiddleware = (
  userById: (id: string) => Promise<User | undefined>,
  secretOrKey: string
) => {
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

  return passport.authenticate('jwt', { session: false })
}

declare global {
  namespace Express {
    interface User { id: string }
  }
}