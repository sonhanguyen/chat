const { NODE_ENV, PORT, JWT_KEY, JWT_EXPIRATION } = process.env

const config = {
  jwtExpiration: Number(JWT_EXPIRATION) || 30 * 24 * 60 * 60, // a month in secs
  env: NODE_ENV || 'development',
  webServerPort: Number(PORT) || 3000,
  jwtKey: JWT_KEY || 'secret'
}

export default config
export type Config = typeof config
