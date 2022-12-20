import { api } from '../client/services'
import React from 'react'

const createHandler = ({ 
  onLoggedIn,
  login
}: Props) =>
  (evt: React.FormEvent<HTMLFormElement> & { target: HTMLFormElement }) => {
    evt.preventDefault()
    const cred = Object.fromEntries(new FormData(evt.target))
    
    login(cred as any).then(onLoggedIn)
  }

type Props = {
  login: typeof api['login']
  onLoggedIn(): void
}

const Login: React.FunctionComponent<Props> = (props) => {
  return <form onSubmit={createHandler(props)}>
    <input name='username' />
    <input type='password' name='password' />
    <button>Login</button>
  </form>
}

Login.defaultProps = {
  onLoggedIn: () => location.href = '/',
  login: api.login
}

export default Login