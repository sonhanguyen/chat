import { connect } from '../knexfile'
import Messages from './Messages'
import Users from './Users'

export const messages = new Messages(connect)
export const  users = new Users(connect)
