import { Strategy, ExtractJwt } from 'passport-jwt'
import { type User as Me } from '../dal/entities/Users'
import passport from 'passport'

export const makeMiddleware = (
  userById: (id: string) => Promise<Me | undefined>,
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
    interface User extends Me {
      // the passport library creates this global type so that we can customize (by merging) the type of injected req.user
      // typescriptlang.org/docs/handbook/declaration-merging.html
    }
  }
}