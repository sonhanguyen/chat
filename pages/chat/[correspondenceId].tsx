import React from 'react'
import { observable } from 'mobx'
import styled from 'styled-components'

import Scrollable from '../../client/components/Scrollable'
import Conversation from '../../client/components/Conversation'
import { type Message } from '../../client/components/Message'
import { PropsOf, useAction, withDefaults, withRouteQuery } from '../../client/lib'
import { api, pubsub } from '../../client/services'
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

type Props = {
  onMessage(_: (_: Message) => void): Chat['unsubscribe']
  loadHistory(_?: number): Promise<Paginated<Message>>
  send(_: string): Promise<void>
}

type State = { hasMore?: null | boolean | Promise<void> }

class Chat extends React.Component<Props, State> {
  state: State = {}

  readonly messages = observable.array<Message>()

  private unsubscribe?: () => void
  private scrollable = React.createRef<Scrollable>()

  loadHistory = async () => {
    if (this.state.hasMore === false
      || this.state.hasMore instanceof Promise) return

    const [ earliest ] = this.messages
    const query = this.props.loadHistory(earliest?.timestamp)

    this.setState({
      hasMore: query.then(it => this.setState({ hasMore: it.hasMore }))
    })

    const { results } = await query
    results.sort(({ timestamp: t }, next) => t - next.timestamp)

    const existingIds = new Set(this.messages.map(it => it.id))
    this.messages.unshift(...results
      .filter(_ => !existingIds.has(_.id))
    )
  }
  
  showLast = () => setTimeout(
    () => this.scrollable.current?.showLast()
    // setTimeout is needed so mobx reaction finishes updating view
  )
  
  async componentDidMount() {
    await this.loadHistory()
    this.showLast()

    this.unsubscribe = this.props.onMessage(msg => {
      this.messages.push(msg)
      this.showLast()
    })
  }

  async componentDidUpdate({ loadHistory }: Readonly<Props>) {
    const correspondenceChanged = loadHistory != this.props.loadHistory

    if (correspondenceChanged) {
      this.messages.clear()
      this.setState({ hasMore: null })
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
        <Scrollable
          ref={this.scrollable}
          scrollToTop={{
            handler: this.loadHistory
          }}
        >
          <span style={{ margin: 'auto' }} onClick={this.loadHistory}>
            {this.state.hasMore === true && 'more...'}
          </span>
          <Conversation messages={this.messages} />
        </Scrollable>    
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

const makeDefaultProps = ({ correspondenceId: userId }: RouteProps): Props => {
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
      const { results, hasMore } = await api.loadChatHistory(userId, limit, beforeTs)

      return {
        results: results.map(mapMessage),
        hasMore
      }
    },

    async send(msg) {
      await api.send(userId, msg)
    },

    onMessage: handler => pubsub.on('message', msg => {
      if ([msg.sender, msg.receiver].includes(userId)) handler(mapMessage(msg))
    })
  }
}

export default withRouteQuery<RouteProps>()(
  withDefaults(makeDefaultProps, 'correspondenceId')(Chat)
)
