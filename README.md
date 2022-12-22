# Project: Messenger

https://www.veed.io/view/355cd794-58a4-4f67-80e9-70fdd2edd844?panel=share

The build includes the following:

- [x] responsive - it must have web and mobile versions.
- [x] Authentication: handrolled a JWT based flow, missing are refresh token and token invalidation/black listing, I'm sure there are more as auth is complicated
- [x] A list of all the users in the system
- [ ] A list of "active" conversations
- [ ] Conversations with messages from today OR newer than 1 hour
- [x] A "conversation" view between you and another individual in the system
- [x] The conversation should auto-update. Method for auto-updating is up to you.

Extras Items:

- [x] "Liveness" - the system should be able to tell if the user is active (based on the liveliness of the socket.io connection)
- [x] Infinite Scroll of Messages in a Conversation: partically, implemented and is ok on the backend side but the front end side has a bug that I didn't have time to look into, so I disabled it (look up for `limit = 0`)
- [ ] Didn't have time to do test but inversion of control is followed in both front and back end (those `index.ts` are composition roots), so it should be easy to unit test

## Run

`docker-compose up`

Check the `seeds` directory for the credentials to use. As this reuses the same token across tabs you've have to login as different users on incognito or another browser to test.

## Develop locally
Requirements
- nodejs
- don't need `postgres` if you use the `docker-compose` service, to connect to `postgres` running on `localhost` do `DB_HOST=localhost ./cmd run`.

For more commands, look up the files called `cmd` (2 of them, one for Data Access Layer). And check out the 2 `config.ts` for list of env variables

## Technical details

Not a lot, this is a boring CRUD app, it uses `socket.io` as an abstraction for server push messages (the equivalent of Rails's Action Cable). Since sockets are simplex (server to client, client to server is all REST), I didn't bother to configure socket.io to use web socket transport, so it's actually long polling with automatic reconnect.

Sockets are also authenticated with JWT

The data model is greatly simplified, only `User` and `Message`. I haven't gotten to do the group chats so haven't had need for something like `Conversation`. `User` is both credential and user profile which is not how a more sophisticated system would do it.
