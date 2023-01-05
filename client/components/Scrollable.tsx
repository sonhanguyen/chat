import React from 'react'
import styled from 'styled-components'
import { scrollable } from './ux'

const useScrollHandler = (onScrollToTop: () => void, threshold = 10) => {
  const [ onScroll ] = React.useState(() => {
    let scrollTop: number

    return ({ target }: React.UIEvent<HTMLDivElement> & { target: HTMLDivElement }) => {
      const prev = scrollTop; ({ scrollTop } = target)

      if (scrollTop < threshold && prev >= threshold) onScrollToTop()
    }
  })

  return onScroll
}

type Scrollable = { showLast(): void }

type ScrollableProps = {
  children?: React.ReactNode
  className?: string

  scrollToTop?: {
    threshold?: number
    handler(): void
  }
}

export const Scrollable = styled(
  React.forwardRef<Scrollable, ScrollableProps>(
    ({
      children,
      className,
      scrollToTop: {
        handler = () => {},
        threshold
      } = {},
    }, ref) => {
      const onMountEvent = ref && ((mounted: HTMLDivElement | null) => {
        const refCallback = typeof ref === 'function' ? ref
          : (it: typeof ref.current) => ref.current = it

        refCallback(mounted && {
          showLast() {
            mounted.scrollTop = mounted.scrollHeight
          }
        })
      })

      return <div
        className={className}
        onScroll={useScrollHandler(handler, threshold)}
        ref={onMountEvent}
      >
        {children}
      </div>
    }
  )
)(scrollable)

export default Scrollable
