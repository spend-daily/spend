import knex from 'knex'

import { DB_ENDPOINT } from './config'

const db = knex({
  connection: DB_ENDPOINT,
  dialect: 'pg',
  multipleStatements: true
})

export default db
