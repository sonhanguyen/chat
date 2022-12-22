import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { api } from '../client/services'
import { useAction } from '../client/lib'

if (typeof document == 'object') {
  const style = document.createElement('style')

  document.head.appendChild(style)
  style.appendChild(document.createTextNode(`
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');
    
    body {
      margin: 0;
      overflow: hidden;
      font-family: "Open Sans", sans-serif;
      font-size: 1.5rem;
    }
  `))
}

// The logic to authorize protected route is implemented here,
// for simplicity, normally the `_app` is intended for layout and
// authorization is done while server rendering, to save extra requests

export default function Protected({ Component, pageProps }: AppProps) {
  const auth = useAction(api.users.myProfile, true)
  const router = useRouter()

  if (!UNPROTECTED.includes(router.pathname) && (
    auth.pending || !auth.result
  )) {
    if (auth.error) router.push(LOGIN, router.asPath)

    return null
  }

  return <>
    <Component { ...pageProps } />
  </>
}

const LOGIN = '/login'
const UNPROTECTED = [LOGIN, '/_error']