import Api, { AuthData, PubSub } from './Api'
import HttpService from './HttpService'
import LocalStorage from './LocalStorage'

const getAuthToken = () => localData.get('auth')?.token

export const localData = new LocalStorage<{ auth: AuthData }>()
export const http = new HttpService({ getAuthToken })
export const api: Api = new Api({
  saveAuthData: authData => localData.set('auth', authData),
  onAuthorized: _ => {
    pubsub.connect()
    pubsub.on('user', user => {
      api.users.updateStatus(user)
    })
  },
  http,
})

export const pubsub = new PubSub(getAuthToken)

