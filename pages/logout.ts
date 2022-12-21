import React from 'react'

import { localData } from '../client/services'

export default () => {
  React.useEffect(() => {
    localData.clear()
    location.href = '/login'
  }, [])

  return null
}