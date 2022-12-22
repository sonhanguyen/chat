import styled from 'styled-components'
import { PropsOf } from '../lib'

export const rounded = ({ radii = '4px' }) => `
  border-radius: ${radii};
`

export const withBg = (props: {
  bg?: 'active' | 'inactive'
}) => {
  const color = {
    active: 'lightskyblue',
    inactive: 'lightgrey'
  }[props.bg as string]
  
  if (color) return `
    background: ${color};
  `
}

export const verticalBox = (props: { gap?: 'big' | 'small' }) => {
  const { gap = 'none' } = props

  return `
    flex-direction: column;
    display: flex;

    gap: ${{
      big: '1rem',
      small: '.5rem',
      none: 0
    }[gap]};
  `
}

export const padded = (props: { padding?: 'big' | 'small' }) => {
  const { padding = 'medium' } = props

  return `
    padding: ${{
      big: '2rem',
      medium: '1rem',
      small: '.5rem'
    }[padding]};
  `
}

export const Input = styled.input<
  & PropsOf<typeof rounded>
  & PropsOf<typeof padded>
>`
  ${rounded}
  ${padded}

  font-size: 2rem;
`


export const Button = styled.button<
  & PropsOf<typeof rounded>
  & PropsOf<typeof padded>
>`
  ${rounded}
  ${padded}

  &, &:focus{
    outline: none;
    background: transparent;
    border: 1px solid transparent;
    font-size: 2rem;
  }
`

export const scrollable = (props: { dir?: 'y' | 'x' | 'both' }) => {
  let overflow = 'overflow'
  const { dir = 'y' } = props

  if (dir != 'both') overflow += '-' + dir

  return overflow + ': auto;'
}
