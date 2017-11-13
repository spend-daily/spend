import _get from 'lodash.get'
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
  const userId = _get(event, 'requestContext.authorizer.claims.sub')
  const postgraphQLSchema = await postgraphQLSchemaPromise
  const result = await withPostGraphQLContext(
    {
      pgPool: pool,
      pgDefaultRole: userId || config.USER,
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
  console.log(`Query finished for ${userId}`)
  return context.succeed({
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(result),
    statusCode: 200
  })
}
