import React from 'react'
import { observer } from 'mobx-react'
import Msg, { type Message } from './Message'
import { PropsOf, useAction } from '../lib'
import styled from 'styled-components'
import { padded, scrollable, verticalBox } from './ux'

type ConversationProps = MessagesProps & {
  loadHistory(): Promise<void>
  onScrollToTop?(): void
}

export type Controller = { showLast(): void }

const Conversation = React.forwardRef<
  Controller,
  ConversationProps
>(({ messages, loadHistory, onScrollToTop = () => {} }, ref) => {
    const loadChat = useAction(loadHistory)

    React.useEffect(() => {
      loadChat()
    }, [])

    const onMountEvent = ref && ((mounted: HTMLDivElement | null) => {
      const refFunc = typeof ref === 'function' ? ref
        : (it: typeof ref['current']) => ref.current = it

      refFunc(mounted && {
        showLast() {
          mounted.scrollTop = mounted.scrollHeight
        }
      })
    })

    return <Scrollable
      onScroll={forwardScrollEvent(React.useCallback(onScrollToTop, []))}
      ref={onMountEvent}
      gap='big'
    >
      <Messages messages={messages} />
    </Scrollable>
  }
)

type MessagesProps = {
  messages: Message[]
}

const Messages = observer(({ messages }: MessagesProps) =>
  <>
    {messages.map(message => {
      let Wrapper = theirs
      if (message.sender.isMe) Wrapper = mine
      
      return <Wrapper key={message.id}><Msg {...message}/></Wrapper>
    })}
  </>
)

const theirs = styled.div``,
      mine = styled.div``

const Scrollable = styled.div<
  & PropsOf<typeof verticalBox>
  & PropsOf<typeof scrollable>
  & PropsOf<typeof padded>
>`
  ${verticalBox}
  ${scrollable}
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

const forwardScrollEvent = (onScrollToTop: () => void, threshold = 10) =>
  ({ target }: React.UIEvent<HTMLDivElement> & { target: HTMLDivElement }) => {
    if (target.scrollTop < threshold) onScrollToTop()
  }