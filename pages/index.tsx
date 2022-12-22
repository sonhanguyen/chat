import React from 'react'
import { useRouter } from 'next/router'

import MasterLayout, { type Props } from '../client/components/MasterLayout'
import UserList from '../client/components/UserList'
import { withHook } from '../client/lib'
import { api } from '../client/services'
import { User } from '../client/services/UserStore'
import { observer } from 'mobx-react'

const usersProps = () => {
  const { users } = api
  const router = useRouter()

  return {
    onSelect({ id }: User) {
      router.push('/chat/' + id)
    },
    loadUsers: users.loadFriends,
    users: users.all.filter(user => user.id != users.auth?.id)
  }
}

const Users = observer(withHook(usersProps)(UserList))

export default function Layout(props: { children?: React.ReactNode }) {
  return <MasterLayout main={<Users />} {...props} />
}
