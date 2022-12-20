import { Router } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config';
import { users } from '../services';

export default Router()
  .post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await users.byCredential(username, password)

    if (!user) return res.status(404).json({ message: 'Username not found' })

    jwt.sign(user, config.jwtKey, {
      expiresIn: config.jwtExpiration,
    }, (err, token) => {
        if (err) return res.status(404).json(err)

        res.json({
          token: 'Bearer ' + token,
          ...user
          // This is redundant since the decoded token already contains the user as payload.
          // However, it's just more convenient as client doesn't have to decode.
          // For this simple project, nothing needs to be secured otherwise we could use
          // approaches such as JWE
        })
      }
    )
  })

// TODO refresh_token and token invalidation