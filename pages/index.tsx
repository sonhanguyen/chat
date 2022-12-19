import { api } from '../client/services'
import React from 'react'

const createHandler = (login: typeof api['login']) =>
  (evt: React.FormEvent<HTMLFormElement> & { target: HTMLFormElement }) => {
    evt.preventDefault()
    const cred = Object.fromEntries(new FormData(evt.target))
    
    login(cred as any).then(console.log)
  }

type Props = {
  login: typeof api['login']
}

const Login: React.FunctionComponent<Props> = ({ login }) => {
  return <form onSubmit={createHandler(login)}>
    <input name='username' />
    <input type='password' name='password' />
    <button>Login</button>
  </form>
}

Login.defaultProps = {
  login: api.login
}

export default Login