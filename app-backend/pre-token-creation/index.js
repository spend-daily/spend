import _get from 'lodash.get'

export default function postTokenCreation(event, context) {
  const userId = _get(event, 'request.userAttributes.sub', null)

  if (!userId) {
    console.error('No userId found!')
    return context.fail(event)
  }

  event.response.claimsOverrideDetails = {
    role: userId
  }

  context.succeed(event)
}
