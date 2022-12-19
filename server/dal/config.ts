const {
  DB_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env

const config = {
  database: POSTGRES_DB || POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: DB_HOST,
}

export default config
export type DbConfig = typeof config
