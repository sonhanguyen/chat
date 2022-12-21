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

export type Props = Message & { className?: string }

const Message: React.FunctionComponent<Props> = ({ className, body, timestamp }) => {
  return <div className={className}>
    <span>{relativeTime(timestamp)}</span>
    {body}
  </div>
}

export default styled(Message).attrs(({ sender }) => ({
  bg: sender.isMe ? 'inactive' : 'active'
}))<
  & PropsOf<typeof padded>
  & PropsOf<typeof withBg>
  & PropsOf<typeof rounded>
>`
  ${padded({ padding: 'small' })}
  ${rounded}
  ${withBg}
  ${verticalBox}
`
