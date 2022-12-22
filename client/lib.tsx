import React from 'react'

type OK<T> = { result: T }
type Error<T> = { error: T }

type Pending<T> = { pending: Promise<T> }
type Resolved = {
  reset(): void
}

/**
 * @param func: an async function
 * @returns same function with extra states (`error`, `result`, `pending`) that are bound to react render cycle
 * 
 * basically poor man's `react-query`, which is not used here because I think consuming api 
 * response in the view function is a fundamentally flawed approach, we'll see that `result` is 
 * actually not used (or used paringly) in this repo
 */
export const useAction = <
  F extends (..._: any) => Promise<any>,
  E = any,
  R = F extends () => Promise<infer R> ? R : ReturnType<F>
>(func: F, onMount?: boolean): F & Readonly<Resolved & Partial<
  OK<R>
  & Error<E>
  & Pending<R>
>> => {
  type State = ReturnType<typeof useAction>
  const make = (pending?: Promise<R>): State => {
    const initial: F = (async (...args: Parameters<F>) => {
      if (pending) return pending
      const promise = func(...args)
      setActionState((_: State) => make(promise))
      const resolvedState = make()
      try {
        Object.assign(resolvedState, { result: await promise })
      } catch (error) {
        Object.assign(resolvedState, { error })
      }

      setActionState((_: State) => resolvedState)

      // passing the function form of SetStateAction to `setState` is required, b/c state here is a
      // function (has the type F), so if passed as value to setState, react will think we're using
      // said function form of `SetStateAction`, and call it, which is not what we want
      // (we're just setting state, not calling the function that state happens to be)
    }) as any
    
    Object.assign(initial, {
      pending,
      reset: () => setActionState((state: State) => {
        if (state.pending || 'error' in state) return make()
        return state
      })
    })

    return initial as any
  }

  const [action, setActionState] = React.useState(make)
  React.useEffect(() => { if (onMount) action() }, [])

  return action as any
}

import { useRouter } from 'next/router'

function withDebugName<T extends {}>(
  decoratorName: string,
  { name, displayName = name }: { name: string, displayName?: string },
  target: T
) {
  return Object.assign(target, {
    displayName: `${decoratorName}(${displayName})`
  })
}

export function withRouteQuery<Q>(
  shouldRender = function whenNotEmpty(query: any): query is Q {
    return !!Object.keys(query).length
  }
) {
  /**
   * @param a react component
   * @returns a component with Q props injected from next router query
   */
  return function <P>(Component: React.ComponentType<P>) {
    const wrapped = (props: Omit<P, keyof Q> & Partial<Q>) => {
      const { query } = useRouter()

      if (shouldRender(query)) return <Component {...query} {...props as any} />
      return null
    }

    return withDebugName(withRouteQuery.name, Component, wrapped)
  }
}


export function withHook<Hook extends (_: any) => any>(
  useProps: Hook, debugName = useProps.name
) {
  return function<P>(Component: React.ComponentType<P>) {
    const wrapped = (props:
      & Omit<P, keyof ReturnType<Hook>>
      & PropsOf<Hook>
      & Partial<ReturnType<Hook>>
    ) => {
      const injected = { ...props }
      const toInject = useProps(props)

      for (const prop in toInject) {
        if (prop in props) continue
        injected[prop] = toInject[prop] as any
      }

      return <Component { ...injected as any } />
    }
    
    return withDebugName(debugName, Component, wrapped)
  }
}

export function withDefaults<
  Defaults,
  Deps extends string[],
  Props extends Record<Deps[number], any>
>(
  defaultProps: (_: Props) => Defaults,
  ...dependencies: Deps
  // if specified the props will be re-calculated everytime any of
  // the dependency props update
) {
  return withHook<typeof defaultProps>(
    props => React.useMemo(
      () => defaultProps(props as any),
      dependencies.map(key => (props as any)[key])
    ),
    withDefaults.name
  )
}

export type PropsOf<T> =
  T extends React.ComponentType<infer P> ? P :
  T extends (..._: [infer P, ...any ]) => any ? P : {}

export const relativeTime = (timestamp: number) => {
  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto'
  })

  const DIVISIONS = Array<{
    unit: Intl.RelativeTimeFormatUnit,
    base: number
  }>(
    { base: 60, unit: 'seconds' },
    { base: 60, unit: 'minutes' },
    { base: 24, unit: 'hours' },
    { base: 7, unit: 'days' },
    { base: 4.34524, unit: 'weeks' },
    { base: 12, unit: 'months' }
  )

  let duration = (timestamp - Date.now()) / 1000

  const as = (unit: Intl.RelativeTimeFormatUnit) =>
    formatter.format(Math.round(duration), unit)

  for (let i = 0; i < DIVISIONS.length; ++i) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.base) return as(division.unit)

    duration /= division.base
  }

  return as('year')
}

