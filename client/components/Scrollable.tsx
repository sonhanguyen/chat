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

export type Controller = { showLast(): void }

type ScrollableProps = {
  children?: React.ReactNode
  onScrollToTop?(): void
  className?: string
}

export const Scrollable = styled(
  React.forwardRef<Controller, ScrollableProps>(
    ({ children, className, onScrollToTop = () => {} }, ref) => {
      const onMountEvent = ref && ((mounted: HTMLDivElement | null) => {
        const refFunc = typeof ref === 'function' ? ref
          : (it: typeof ref['current']) => ref.current = it

        refFunc(mounted && {
          showLast() {
            mounted.scrollTop = mounted.scrollHeight
          }
        })
      })

      return <div
        className={className}
        onScroll={useScrollHandler(onScrollToTop)}
        ref={onMountEvent}
      >
        {children}
      </div>
    }
  )
)(scrollable)

export default Scrollable
