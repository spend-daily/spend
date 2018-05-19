import jwk from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import fetch from 'node-fetch'

const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = process.env

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument:
      effect && resource
        ? {
            Version: '2012-10-17',
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
              }
            ]
          }
        : undefined
  }
}

export default async function auth(event, context, callback) {
  console.log(event)
  if (!event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  const tokenValue = tokenParts[1]

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized')
  }

  const token = tokenParts[1]
  const iss = 'https://spend.auth0.com/'

  const jwkRequest = await fetch(`${iss}.well-known/jwks.json`)
  const keys = await jwkRequest.json()

  const k = keys.keys[0]
  const pem = jwkToPem({
    kty: k.kty,
    n: k.n,
    e: k.e
  })

  jwk.verify(token, pem, { issuer: iss }, (err, decoded) => {
    if (err) {
      console.log('Unauthorized user:', err.message)
      callback('Unauthorized')
    } else {
      console.log(decoded)
      callback(
        null,
        generatePolicy(
          'C8npTEMVnBrILsBTI91MOh6dfuZbPVAU@clients',
          'Allow',
          event.methodArn
        )
      )
    }
  })
}
