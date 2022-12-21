import Api, { AuthData, WSClient } from './Api'
import HttpService from './HttpService'
import LocalStorage from './LocalStorage'

const getAuthToken = () => localData.get('auth')?.token

export const localData = new LocalStorage<{ auth: AuthData }>()
export const http = new HttpService(getAuthToken)
export const api: Api = new Api({
  saveAuthData: authData => localData.set('auth', authData),
  onAuthorized: _ => {
    wsClient.connect()
    wsClient.on('user', user => {
      api.users.updateStatus(user)
    })
  },
  http,
})

export const wsClient = new WSClient(getAuthToken)

