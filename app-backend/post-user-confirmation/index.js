import _get from 'lodash.get'

import db from '../database'

export default async function postUserConfirmation(event, context) {
  const userId = _get(event, 'request.userAttributes.sub', null)

  if (!userId) {
    return context.fail('No userID found in userAttributes', event)
  }

  try {
    await db.raw(`create role "${userId}"`)
    await db.raw(`grant "${userId}" to spend`)
  } catch (error) {
    console.error(`role and grants not successful for user ${userId}`, error)
    return context.fail(event)
  }

  console.log(`role and grants successful for ${userId}`)
  return context.succeed(event)
}
