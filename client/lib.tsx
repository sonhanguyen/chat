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
      const promise = func(...args)
      setActionState((_: State) => make(promise))
      // passing the function form of SetStateAction to `setState` is required, b/c state here is a
      // function (has the type F), so if passed as value to setState, react will think we're using
      // said function form of `SetStateAction`, and call it, which is not what we want
      // (we're just setting state, not calling the function that state happens to be)
      const resolvedState = make()
      try {
        Object.assign(resolvedState, { result: await promise })
      } catch (error) {
        Object.assign(resolvedState, { error })
      }

      setActionState((_: State) => resolvedState)
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

export function withNextJsRouteQuery<Q>(
  shouldRender: (it: any) => it is Q = function whenNotEmpty(query: any) {
    return Object.keys(query).length
  } as any
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

    return withDebugName(withNextJsRouteQuery.name, Component, wrapped)
  }
}

export function withDefaults<D, T = {}>(
  defaultProps: (_: T) => D
) {
  return function<P>(Component: React.ComponentType<P>) {
    const wrapped = (props: Omit<P, keyof D> & T & Partial<D>) => {
      const injected = { ...props }

      const defaults = defaultProps(props as any)
      for (const prop in defaults) {
        if (prop in props) continue
        injected[prop] = defaults[prop] as any
      }

      return <Component { ...injected as any } />
    }
    
    return withDebugName(withDefaults.name, Component, wrapped)
  }
}