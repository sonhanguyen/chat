import { Router } from 'express'
import { messages } from '../services'

export default Router()
  .get('/:id', async (req, res) => {
    const { params: { id }, user } = req
    const chatHistory = messages.byParticipants(id, user?.id!)
    res.send(chatHistory)
  })
