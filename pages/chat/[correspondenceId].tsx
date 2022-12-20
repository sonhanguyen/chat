import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { useAction, withDefaults, withNextJsRouteQuery } from '../../client/lib'
import { api, wsClient } from '../../client/services'
import { Message as Msg } from '../../client/services/Api'

type ConversationProps = {
  messages: Message[]
  loadHistory(): Promise<void>
}

type Message = {
  id: string
  body: string
  timestamp: Date
  sender: {
    isMe?: boolean
    name: string
  }
}

const Message: React.FunctionComponent<Message> = ({ body }) => {
  return <span>{body}</span>
}

const Conversation = observer(
  ({ messages, loadHistory }: ConversationProps) => {
    const loadChat = useAction(loadHistory)

    React.useEffect(() => {
      loadChat()
    }, [])

    return <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
    </div>
  }
)

type NewMessageProps = {
  send(_: string): Promise<void>
}

const NewMessage = (props: NewMessageProps) => {
  const send = useAction(props.send)
  const submit = (evt: React.MouseEvent<HTMLButtonElement> & { target: HTMLElement }) => {
    const textarea = evt.target.parentElement?.querySelector('textarea')
    if (textarea) send(textarea.value).then(() => textarea.value = '')
  }

  return <fieldset disabled={!!send.pending}>
    <textarea />
    <button onClick={submit}>Send</button>
  </fieldset>
}

type ChatProps = {
  onMessage(_: (_: Message) => void): Chat['unsubscribe']
  loadHistory(): Promise<Message[]>
  send(_: string): Promise<void>
}

class Chat extends React.Component<ChatProps> {
  messages = observable.array<Message>()
  unsubscribe?: () => void

  loadHistory = async () => {
    const messages = await this.props.loadHistory()
    const ids = new Set(this.messages.map(it => it.id))

    this.messages.unshift(...messages
      .filter(msg => !ids.has(msg.id))
    )
  }

  componentDidMount(): void {
    this.unsubscribe = this.props.onMessage(console.log)
  }

  componentWillUnmount(): void {
    this.unsubscribe?.()
    delete this.unsubscribe
  }

  render() {
    return <div>
      <Conversation
        messages={this.messages}
        loadHistory={this.loadHistory}
      />
      <NewMessage send={this.props.send}/>
    </div>
  }  
}

type RouteProps = {
  correspondenceId: string
}

const makeDefaultProps = ({ correspondenceId: userId }: RouteProps): ChatProps => {
  const mapMessage = ({ body, sender, timestamp, id }: Msg) => (
    {
      id,
      body,
      timestamp,
      sender: {
        name: 'name',
        isMe: userId != sender
      }
    }
  )

  return {
    async loadHistory() {
      const messages = await api.loadChatHistory(userId)
      return messages.map(mapMessage)
    },

    async send(msg) {
      await api.send(userId, msg)
    },
    onMessage: (handler) => wsClient.on('message', msg => handler(mapMessage(msg)))
  }
}

export default withNextJsRouteQuery<RouteProps>()(
  withDefaults(makeDefaultProps)(Chat)
)
