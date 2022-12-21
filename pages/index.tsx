import { autorun, observable } from 'mobx'
import UserList from '../client/components/UserList'
import { withDefaults } from '../client/lib'
import { api } from '../client/services'
import { User } from '../client/services/UserStore'

const makeDefaultProps = () => {
  const { users } = api
  const observableUsers = observable.array<User>()
  
  autorun(() => {
    observableUsers.replace(
      users.all.filter(user => user.id != users.auth?.id)
    )

    console.log(users.all)
  })

  return {
    loadUsers: users.loadFriends,
    users: observableUsers
  }
}

export default withDefaults(makeDefaultProps)(UserList)