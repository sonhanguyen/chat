import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { api } from '../client/services'
import { useAction } from '../client/lib'
import { createGlobalStyle } from 'styled-components'

const Style = createGlobalStyle`
  body {
    margin: 0;
  }
`

// The logic to authorize protected route is implemented here
// this is for simplicity, normally the `_app` is intended for layout and
// authorization is done while server rendering, to save extra requests

export default function Protected({ Component, pageProps }: AppProps) {
  const auth = useAction(api.users.myProfile, true)
  const router = useRouter()

  if (![LOGIN, '/_error'].includes(router.pathname) && (
    auth.pending || !auth.result
  )) {
    if (auth.error) router.push(LOGIN)

    return null
  }

  return <>
    <Style />
    <Component { ...pageProps } />
  </>
}

const LOGIN = '/login'
