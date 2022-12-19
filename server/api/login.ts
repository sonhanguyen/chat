import { Router } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config';
import { userRepo } from '../services';

export default Router()
  .post('/', async (req, res) => {
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    const { username, password } = req.body
    console.log({ username, password })

    const user = await userRepo.byCredential(username, password)
    // Check if user exists
    if (!user) return res.status(404).json({ message: 'Username not found' })

    jwt.sign(user, config.jwtKey, {
      expiresIn: 31556926, // 1 year in seconds
    }, (err, token) => {
        res.json({
          token: 'Bearer ' + token,
          ...user
        })
      }
    )
  })
