const config = {
  env: process.env.NODE_ENV || 'development',
  webServerPort: Number(process.env.PORT),
  jwtKey: process.env.JWT_KEY || 'secret'
}

export default config
export type Config = typeof config
