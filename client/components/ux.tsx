export const bordered = ({ border = '2px' }) => `
  border: ${border} solid black;
`

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

export const verticalBox = () => `
  flex-direction: column;
  display: flex;
`

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

export const scrollable = (props: { dir?: 'y' | 'x' | 'both' }) => {
  let overflow = 'overflow'
  const { dir = 'y' } = props

  if (dir != 'both') overflow += '-' + dir

  return overflow + ': auto;'
}
