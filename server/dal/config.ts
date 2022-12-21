const {
  DB_HOST,
  DB_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env

const config = {
  database: POSTGRES_DB || POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: Number(DB_PORT)|| 5432,
  host: DB_HOST
}

export default config
export type DbConfig = typeof config
