import styled from 'styled-components'
import React from 'react'
import { api } from '../client/services'
import { Button, Input, verticalBox } from '../client/components/ux'

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
  return <Form onSubmit={createHandler(props)}>
    <Input name='username' placeholder='User Name'/>
    <Input type='password' name='password' placeholder='Password (ONE space)'/>
    <Button>Login</Button>
  </Form>
}

const Form = styled.form`
  ${verticalBox}

  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

Login.defaultProps = {
  onLoggedIn: () => {
    if (location.pathname != '/login') location.reload()
    // if the adress bar's url isn't LOGIN, then it's the route to redirect back
    // when logged in, so we simply tell browser to load it
    else location.href = '/'
  },
  login: api.login
}

export default Login