import styled from 'styled-components'
import { PropsOf, relativeTime } from '../lib'
import { padded, rounded, verticalBox, withBg } from './ux'

export type Message = {
  id: string
  body: string
  timestamp: number
  sender: {
    isMe?: boolean
    name: string
  }
}

export type Props = Message & {
  className?: string
  right?: boolean
}

const Message: React.FunctionComponent<Props> = ({ className, body, sender, timestamp }) => {
  return <div className={className}>
    <Body bg={ sender.isMe? 'inactive' : 'active' }>{body}</Body>
    <Time>{relativeTime(timestamp)}</Time>
  </div>
}

const Body = styled((props: { className?: string, children: string }) =>
  <div className={props.className}>
    {props.children
      .split(/(\n)/g)
      .map(it => it == '\n' ? <br /> : it)
    }
  </div>
)<
  & PropsOf<typeof verticalBox>
  & PropsOf<typeof padded>
  & PropsOf<typeof rounded>
  & PropsOf<typeof withBg>
>`
  ${padded({ padding: 'small' })}
  ${verticalBox}
  ${rounded}
  ${withBg}
`

const Time = styled.div``

export default styled(Message)`
  ${verticalBox}

  display: inline-flex;
  position: relative;
  
  ${Time} {
    position: absolute;
    font-size: .5rem;
    color: gray;

    ${({ sender }) => sender.isMe
      ? `
        left: calc(-100% - 6rem);
        right: calc(100% + .5rem);
        bottom: 0;
      `
      : `
        left: 0;
        top: 100%;
      `
    }
  }
`
