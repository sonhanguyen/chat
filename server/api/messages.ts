import { Router } from 'express'
import { messages } from '../services'
export type { Message, Paginated } from '../dal/entities/Messages'
import server from '..'

export default Router()
  .get('/conversation', async (req, res) => {
    const { query: { withUser, before, limit }, user } = req
    const chatHistory = await messages.byParticipants({
      users: [ user?.id!, withUser as string ],
      before: Number(before),
      limit: Number(limit)
    })

    res.send(chatHistory)
  })
  .post('/', async (req, res) => {
    const { body: { to, body }, user } = req
    const from = user?.id!
    const message = await messages.create(body, from, to)
    
    /// broadcast to connected clients of both sender & receiver
    server.socket?.emit(to, 'message', message)
    server.socket?.emit(from, 'message', message)

    // TODO:
    // a way to associate req with the socket id, to exclude it
    // from the broadcasting (being from the specific client that sent)

    res.send(message)
  })
