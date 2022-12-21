import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { PropsOf } from '../lib'
import { User } from '../services/UserStore'
import { padded, scrollable, verticalBox } from './ux'

type UserListProps = {
  onSelect?(_: User): void
  loadUsers(): Promise<void>
  users: User[]
}

const UserList = observer(
  ({ users, loadUsers, onSelect }: UserListProps) => {

    React.useEffect(() => {
      loadUsers()
    }, [])

    return <Layout>
      {users.map(user =>
        <User
          {...user} 
          key={user.id}
          onClick={() => onSelect?.(user)} />
      )}
    </Layout>
  }
)

const User: React.ComponentType<User & {
  onClick?(): void
}> = ({ onClick, ...props }) =>
  <user.layout
    onClick={onClick}
    {...props}
  >
    <user.name active={props.connected}>{props.name}</user.name>
  </user.layout>

const user = {
  layout: styled.div<User>``,
  name: styled.div((props: { active?: boolean }) => props.active
    ? 'font-weight: bold;'
    : 'color: grey;'
  )
}

const Layout = styled.div<
  & PropsOf<typeof scrollable>
  & PropsOf<typeof padded>
>`
  ${verticalBox}
  ${padded}
  ${scrollable}

 
`

export default UserList

