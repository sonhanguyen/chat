import React from 'react'
import { observable } from 'mobx'
import styled from 'styled-components'

import Conversation, { type Controller as Scrollable } from '../../client/components/Conversation'
import { type Message } from '../../client/components/Message'
import { PropsOf, useAction, withDefaults, withRouteQuery } from '../../client/lib'
import { api, wsClient } from '../../client/services'
import { Message as Msg, Paginated } from '../../client/services/Api'
import { rounded, verticalBox, withBg } from '../../client/components/ux'
import Layout from '..'

type NewMessageProps = {
  send(_: string): Promise<void>
}

const NewMessage = (props: NewMessageProps) => {
  const send = useAction(props.send)
  const submit = (evt: React.MouseEvent<HTMLButtonElement> & { target: HTMLElement }) => {
    const textarea = evt.target.parentElement?.querySelector('textarea')
    if (textarea) send(textarea.value).then(() => textarea.value = '')
  }

  return <ChatInput disabled={!!send.pending}>
    <Textarea bg='inactive' />
    <button onClick={submit}>Send</button>
  </ChatInput>
}

const ChatInput = styled.fieldset`
  display: inline;
  position: relative;
  text-align: right;
  border: none;

  & > button {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

const Textarea = styled.textarea<
  & PropsOf<typeof rounded>
  & PropsOf<typeof withBg>
>`
  ${rounded}
  ${withBg}

  overflow: auto;
  outline: none;
  box-shadow: none;
  border-style: none;
  resize: none;

  font-size: 2rem;
`

type ChatProps = {
  onMessage(_: (_: Message) => void): Chat['unsubscribe']
  loadHistory(_?: number): Promise<Paginated<Message>>
  send(_: string): Promise<void>
}

class Chat extends React.Component<ChatProps> {
  messages = observable.array<Message>()
  hasMore?: boolean

  private unsubscribe?: () => void
  private scrollable = React.createRef<Scrollable>()

  loadHistory = async () => {
    if (this.hasMore === false) return
    const [ earliest ] = this.messages
    const { messages, hasMore } = await this.props.loadHistory(earliest?.timestamp)

    this.hasMore = hasMore

    const ids = new Set(this.messages.map(it => it.id))

    this.messages.unshift(...messages
      .filter(msg => !ids.has(msg.id))
    )
  }
  
  showLast = (delay?: number) => setTimeout(
    () => this.scrollable.current?.showLast(),
    delay // the view might not be ready/updated immediately
  )
  
  componentDidMount(): void {
    this.showLast(500)

    this.unsubscribe = this.props.onMessage(msg => {
      this.messages.push(msg)
      this.showLast()
    })
  }

  async componentDidUpdate({ loadHistory }: Readonly<ChatProps>) {
    if (loadHistory !== this.props.loadHistory) {
      this.messages.clear()
      delete this.hasMore
      await this.loadHistory()
      this.showLast()
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe?.()
    delete this.unsubscribe
  }

  render() {
    return <Layout>
      <ChatLayout>
        <Conversation
          ref={this.scrollable}
          messages={this.messages}
          loadHistory={this.loadHistory}
          onScrollToTop={this.loadHistory}
        />
        <NewMessage send={this.props.send}/>
      </ChatLayout>
    </Layout>
  }  
}

const ChatLayout = styled.div`
  ${verticalBox}

  & > :first-child {
    flex: 1;
  }

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
        name: api.users.byId(sender)?.name!,
        isMe: userId != sender
      }
    }
  )

  return {
    async loadHistory(beforeTs?: number, limit?: number) {
      const { messages, hasMore } = await api.loadChatHistory(userId, limit, beforeTs)

      return {
        messages: messages.map(mapMessage),
        hasMore
      }
    },

    async send(msg) {
      await api.send(userId, msg)
    },

    onMessage: handler => wsClient.on('message', msg => {
      if ([msg.sender, msg.receiver].includes(userId)) handler(mapMessage(msg))
    })
  }
}

export default withRouteQuery<RouteProps>()(
  withDefaults(makeDefaultProps, 'correspondenceId')(Chat)
)
