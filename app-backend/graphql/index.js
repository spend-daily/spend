import 'babel-polyfill'

import {
  createPostGraphQLSchema,
  withPostGraphQLContext
} from 'postgraphql'
import Pool from 'pg-pool'
import { graphql } from 'graphql'

import * as config from '../config'

const postgraphQLSchemaPromise = createPostGraphQLSchema(
  config.DB_ENDPOINT,
  config.DB_NAME
)
const pool = new Pool({
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  min: 1,
  max: 1
})

export default async function graphqlHandler(event, context, callback) {
  console.log(event.requestContext.authorizer.claims)
  const postgraphQLSchema = await postgraphQLSchemaPromise
  const result = await withPostGraphQLContext(
    {
      pgPool: pool,
      pgDefaultRole: config.DB_USER,
    },
    async context => {
      return await graphql(
        postgraphQLSchema,
        JSON.parse(event.body).query,
        null,
        { ...context },
        {}
      )
    }
  )
  callback(null, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result),
    statusCode: 200
  })
}
