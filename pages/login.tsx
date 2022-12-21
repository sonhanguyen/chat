import { api } from '../client/services'
import React from 'react'
import { LOGIN } from './_app'

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
  onLoggedIn: () => {
    if (location.href != LOGIN) location.reload()
    // if the adress bar's url isn't LOGIN, then it's the route to redirect back
    // when logged in, so we simply tell browser to load it
    else location.href = '/'
  },
  login: api.login
}

export default Login