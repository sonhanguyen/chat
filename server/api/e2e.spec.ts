import assert from 'node:assert'
import { describe, before, test, after } from 'node:test'
import { type RequestMethod } from 'pactum/src/exports/mock'
import { spec } from 'pactum'
import Users from '../dal/entities/Users'
import { User } from '../api/users'
import { connect } from '../dal/knexfile'
import { UUID } from '../utils'
import { PubSub } from '../../client/services/Api'
import { Payload } from '../services/PushServer'
import { Message } from '../api/messages'

describe(__filename, async _ => {
  after(async _ => {
    const db = connect()
    await db(Users.TABLE).del()
    await db.destroy()
  })

  const users = Array<User & { token: string }>()
  const pubsub = Array<PubSub>()

  test('auth', async _ => {
    const it = _.test.bind(_)

    const username = { username: 'sonha' }
    const user = { ...username, name: 'Harry' }
    const password = 'dummy'
    let id: string

    await it('register', async _ => {
      ({ id } = await spec()
        .post('/api/register')
        .withBody({
          ...user,
          password
        })
        .expectStatus(200)
        .expectJsonMatch(user)
        .returns('')
      )

      assert.match(id, UUID, '`id` should be an uuid')      
    })

    it('register with the same username', async () => {
      const message = await spec()
        .post('/api/register')
        .withBody({
          ...username,
          password: 'pass',
          name: 'name'
        })
        .expectStatus(400)
        .returns('')

      assert.match(
        message,
        RegExp(`username.+${Object.values(username)}\\) already exists.`),
        'should have error message'
      )
    })

    await it('login', async _ => {  
      users.push(await spec()
        .post('/api/login')
        .withBody({
          ...username,
          password
        })
        .expectStatus(200)
        .expectJsonLike({
          ...user,
          id
        })
        .returns('')
      )

      assert.match(users[0].token, /^Bearer /, 'should return a bearer token')
    })

    it('authorization', async _ => {
      const routes: NodeJS.Dict<Lowercase<RequestMethod>[]> = {
        'users': ['get'],
        'users/me': ['get'],
        'messages': ['post'],
        'messages/conversation': ['get'],
      }

      await Promise.all(Object.entries(routes)
        .flatMap(([path, methods]) => methods!.map(method =>
          _.test(`${method.toUpperCase()} ${path = '/api/' + path}`, async () => {
            const res = await spec()[method](path).expectStatus(401).returns('')
            assert(res == 'Unauthorized', 'should return unauthorized message')
          })
        ))
      )
    })

    await spec().post('/api/register').withBody({
      password: 'password',
      username: 'harry',
      name: 'Ha',
    }).expect(async({ req: { body: { password, username } } }: any) =>
      users.push(await spec().post('/api/login').withBody({ password, username })
        .expectStatus(200)
        .returns('')
      )
    )

    await it('users', async _ => {
      await _.test('GET /api/users/me', async() => {
        const [ { token, ...user } ] = users

        await spec().get('/api/users/me')
          .withHeaders('authorization', token)
          .expectStatus(200)
          .expectJsonLike(user)
      })

      await _.test('GET /api/users', async() => {
        const headers: NodeJS.Dict<string> = {}
        const all = users.map(({ token, ...user }) => {
          headers.authorization = token
          return user
        })

        await spec().get('/api/users')
          .withHeaders(headers)
          .expectStatus(200)
          .expectJsonLike(all)
      })
    })

    await it('pubsub', async _ => {
      const [ { token: token1, ...user1 }, { token: token2, ...user2 } ] = users
  
      await assert.rejects(
        () => new PubSub(() => {}).connect({ reconnection: false }),
        /xhr poll error/,
        'should reject connection request with invalid token'
      )
      
      pubsub[0] = new PubSub(() => token1)
      await pubsub[0].connect({ reconnection: false })

      await _.test('connection status', async _ => {
        await spec().get('/api/users')
          .withHeaders('authorization', token1)
          .expectStatus(200)
          .expectJsonLike([ { ...user1, connected: true }, { ...user2, connected: false } ])

        await _.test('broadcast', async _ => {
          const connected = once('user', pubsub[0])

          pubsub[2] = new PubSub(() => token2)
          await pubsub[2].connect()
      
          await spec().get('/api/users')
            .withHeaders('authorization', token2)
            .expectStatus(200)
            .expectJsonLike([ { ...user1, connected: true }, { ...user2, connected: true } ])
  
          assert.deepEqual(
            await connected,
            { ...user2, connected: true },
            'other users should get notified'
          )
        })
      })
    })
  })

  await test('messages', async _ => {
    const [ { token: token1, id: user1 }, { token: token2, id: user2 } ] = users
    pubsub[1] = new PubSub(() => token1)
    await pubsub[1].connect()
    
    const sent = once('message', pubsub[1])
    const expected = { sender: user1, receiver: user2, body: 'haha' }

    const message = await spec().post('/api/messages')
      .withHeaders('authorization', token1)
      .withBody({ to: user2, body: 'haha' })
      .expectStatus(200)
      .expectJsonLike(expected)
      .returns('')

    assert.deepEqual(
      await sent,
      message,
      'should notify receiver on incomming message'
    )

    const results = [ message ]

    await _.test('/api/messages/conversation', async _ => {
      await spec().get('/api/messages/conversation?withUser=' + user2)
        .withHeaders('authorization', token1)
        .expectStatus(200)
        .expectJsonLike({
          hasMore: false,
          results
        })
        .returns('')

      results.push(await spec().post('/api/messages')
        .withHeaders('authorization', token2)
        .withBody({ to: user1, body: 'lol' })
        .expectStatus(200)
        .returns('')
      )

      await spec().get('/api/messages/conversation?withUser=' + user2)
        .withHeaders('authorization', token1)
        .expectStatus(200)
        .expectJsonLike({
          hasMore: false,
          results
        })
    })
    let page: Message[]
    await _.test('with "limit"', async _ => {
      const limit = 1
      page = results.slice(-limit)
      await spec().get(`/api/messages/conversation?limit=${limit}&withUser=` + user2)
        .withHeaders('authorization', token1)
        .expectStatus(200)
        .expectJsonLike({
          hasMore: true,
          results: page
        })
    })

    await _.test('with "before"', async _ => {
      const limit = 1
      await spec().get(`/api/messages/conversation?before=${
        page.pop()?.timestamp
      }&limit=${limit}&withUser=` + user2)
        .withHeaders('authorization', token1)
        .expectStatus(200)
        .expectJsonLike({
          hasMore: false,
          results: [ message ]
        })
    })
  })
})

function once<E extends keyof Payload>(event: E, socket: PubSub, timeout = 500) {
  return new Promise<Payload[E]>((resolve, reject) => {
    const unsubscribe = socket.on(event, status => {
      resolve(status)
      unsubscribe()
    })
    setTimeout(reject, timeout)
  })
}
