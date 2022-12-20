import React from 'react'
import { observer } from 'mobx-react'
import { api } from '../client/services'
import { useAction } from '../client/lib'

// The logic to authorize protected route is implemented here
// this is for simplicity, normally the `_app` is intended for layout and
// authorization is done while server rendering, to save extra requests

function Protected<P extends {
  Component: React.ComponentType
}>({ Component, ...props }: P) {
  const auth = useAction(api.users.loadProfile, true)
 
  if (auth.pending || !auth.result) return null
  return <Component { ...props } />
}

export default observer(Protected)
