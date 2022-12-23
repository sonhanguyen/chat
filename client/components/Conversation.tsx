import React from 'react'
import { observer } from 'mobx-react'
import Msg, { type Message } from './Message'
import { PropsOf } from '../lib'
import styled from 'styled-components'
import { padded, verticalBox } from './ux'

type ConversationProps = {
  messages: Message[]
}

const Conversation = observer(({ messages }: ConversationProps) =>
  <Layout gap="big">
    {messages.map(message => {
      let Wrapper = theirs
      if (message.sender.isMe) Wrapper = mine
      
      return <Wrapper key={message.id}><Msg {...message}/></Wrapper>
    })}
  </Layout>
)

const theirs = styled.div``,
      mine = styled.div``

const Layout = styled.div<
  & PropsOf<typeof verticalBox>
  & PropsOf<typeof padded>
>`
  ${verticalBox}
  ${padded}
  
  background: white;

  ${theirs},
  ${mine} {
    width: 100%;
  }

  ${mine} > ${Msg} {
    text-align: right;
    float: right;
  }
  
  ${Msg} {
    max-width: 80%;
  }
`

export default Conversation
