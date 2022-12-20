/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.raw(`
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS "User" (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Message" (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    utc_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    sender UUID REFERENCES "User" NOT NULL,
    receiver UUID REFERENCES "User" NOT NULL,
    body TEXT NOT NULL
  );
`)

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => knex.raw(`
  DROP TABLE IF EXISTS "Message";
  DROP TABLE IF EXISTS "User";
`)
