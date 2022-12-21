import React from 'react'
import { observer } from 'mobx-react'
import Msg, { type Message as message } from './Message'
import { PropsOf, useAction } from '../lib'
import styled from 'styled-components'
import { padded, scrollable, verticalBox } from './ux'

type ConversationProps = {
  messages: message[]
  loadHistory(): Promise<void>
}

const Conversation = observer(
  ({ messages, loadHistory }: ConversationProps) => {
    const loadChat = useAction(loadHistory)

    React.useEffect(() => {
      loadChat()
    }, [])

    return <Layout>
      {messages.map(message => {
        let Wrapper = theirs
        if (message.sender.isMe) Wrapper = mine
        
        return <Wrapper key={message.id}><Msg {...message}/></Wrapper>
      })}
    </Layout>
  }
)

const theirs = styled.div``,
      mine = styled.div``

const Layout = styled.div<
  & PropsOf<typeof scrollable>
  & PropsOf<typeof padded>
>`
  ${verticalBox}
  ${padded}
  ${scrollable}

  ${theirs},
  ${mine} {
    width: 100%;
  }

  ${mine} > ${Msg} {
    text-align: right;
    float: right;
  }
  
  ${Msg} {
    display: inline-flex;
    max-width: 80%;
  }
`

export default Conversation