import styled from 'styled-components'
import React from 'react'

export type Props = {
  children?: React.ReactNode
  main: React.ReactNode
}

export default ({ main, children }: Props) => {
  return <Layout>
    <Master>{main}</Master>
    <Detail>{children}</Detail>
  </Layout>
}

const Master = styled.div``

const Detail = styled.div``

const Layout = styled.div`
  @media screen and (orientation: portrait) {
    position: relative;

    ${Master},
    ${Detail} {
      position: absolute;
    }
  }

  @media screen and (orientation: landscape) {
    display: flex;
  }
`