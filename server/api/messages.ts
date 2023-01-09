import { RequestHandler, Router } from 'express'
import { Optional, Record, String } from 'runtypes'
export type { Message, Paginated } from '../dal/entities/Messages'
import type { Message, Paginated } from '../dal/entities/Messages'
import server from '..'
import { UUID } from '../utils'
import { messages } from '../services'

export enum ValidationError {
  INVALID_UUID = 'not an uuid',
  NOT_POSITIVE_INTEGER = 'not a positive integer',
  EMPTY_MESSAGE = 'message `body` must not be empty'
}

const Uuid = String.withConstraint(
  text => UUID.test(text) || ValidationError.INVALID_UUID
)

const Natural = String.withConstraint(value =>
  /^[1-9]\d*$/.test(value) || ValidationError.NOT_POSITIVE_INTEGER
)

const Body = Record({
  to: Uuid,
  body: String.withConstraint(
    text => text.trim() !== '' || ValidationError.EMPTY_MESSAGE
  ),
})

const Query = Record({
  withUser: Uuid,
  before: Optional(Natural),
  limit: Optional(Natural)
})

export default Router()
  .get('/conversation', validated(Record({ query: Query }).assert)<Paginated>(
    async ({ user, query: { withUser, before, limit } }, res) => {
      const chatHistory = await messages.byParticipants({
        users: [ user?.id!, withUser ],
        before: Number(before),
        limit: Number(limit)
      })

      res.json(chatHistory)
    }
  ))
  .post('/', validated(Record({ body: Body }).assert)<Message>(
    async ({ user, body: { to, body } }, res) => {
      const from = user?.id!
      const message = await messages.create(body, from, to)
      
      /// broadcast to connected clients of both sender & receiver
      server.push?.emit(to, 'message', message)
      server.push?.emit(from, 'message', message)

      // TODO:
      // a way to associate req with the socket id, to exclude it
      // from the broadcasting (being from the specific client that sent)

      res.json(message)
    }
  ))

/**
 * 
 * @param validate a function that throws if `request` is invalid
 * @returns a higher order function, that takes a handler for the happy path,
 *          and returns a handler that validates request with @see validate
 */
function validated<Req>(validate: (request: any) => asserts request is Req) : {
  <Res = any>(_: RequestHandler<
    Extract<Req, { params: NodeJS.Dict<string> }>['params'],
    Res,
    Req extends { body: infer T } ? T : any,
    Extract<Req, { query: NodeJS.Dict<string> }>['query']
  >): RequestHandler
} {
  return handler => (req, res, next) => {
    try { validate(req) }
    catch (error) {
      return res
        .status(400)
        .send(error)
    }
    return handler(req as any, res, next)
  }
}
