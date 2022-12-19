import Api, { AuthData, WSClient } from './Api'
import HttpService from './HttpService'
import LocalDataService from './LocalStorage'

const getAuthToken = () => localData.get('auth')?.token

export const localData = new LocalDataService<{ auth: AuthData }>()
export const http = new HttpService(getAuthToken)
export const api: Api = new Api(
  http,
  authData => localData.set('auth', authData)
)

export const wsClient = new WSClient(getAuthToken)
wsClient.connect()
