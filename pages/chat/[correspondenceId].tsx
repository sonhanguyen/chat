import { observable } from 'mobx'
import React from 'react'
import styled from 'styled-components'

import Conversation from '../../client/components/Conversation'
import { type Message } from '../../client/components/Message'
import { useAction, withDefaults, withNextJsRouteQuery } from '../../client/lib'
import { api, wsClient } from '../../client/services'
import { Message as Msg } from '../../client/services/Api'
import { verticalBox } from '../../client/components/ux'

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
    this.unsubscribe = this.props.onMessage(
      msg => this.messages.push(msg)
    )
  }

  componentWillUnmount(): void {
    this.unsubscribe?.()
    delete this.unsubscribe
  }

  render() {
    return <Layout>
      <Conversation
        messages={this.messages}
        loadHistory={this.loadHistory}
      />
      <NewMessage send={this.props.send}/>
    </Layout>
  }  
}

const Layout = styled.div`
  ${verticalBox}

  height: 100vh;
`

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
    onMessage: handler => wsClient.on('message', msg => {
      if ([msg.sender, msg.receiver].includes(userId)) handler(mapMessage(msg))
    })
  }
}

export default withNextJsRouteQuery<RouteProps>()(
  withDefaults(makeDefaultProps)(Chat)
)
