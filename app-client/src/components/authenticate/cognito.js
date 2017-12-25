import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'

AWS.config.region = 'us-west-2'

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID
}
const userPool = new CognitoUserPool(poolData)

export async function register({ name, password }) {
  return new Promise((resolve, reject) => {
    userPool.signUp(name, password, [], null, (error, result) => {
      if (error) {
        return reject(error)
      }

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: poolData.IdentityPoolId
      })

      resolve(result.user)
    })
  })
}

export async function login({ name, password }) {
  return new Promise((resolve, reject) => {
    let cognitoUser = new CognitoUser({
      Username: name,
      Pool: userPool
    })

    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username: name,
        Password: password
      }),
      {
        onSuccess: result => {
          localStorage.setItem('token', result.idToken.jwtToken)
          localStorage.setItem('refresh', result.refreshToken.token)
          resolve()
        },
        onFailure: reject
      }
    )
  })
}

export async function refresh() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser()

    if (cognitoUser != null) {
      cognitoUser.getSession(function(error, session) {
        if (error) {
          console.log(error)
          reject(error)
        } else {
          resolve(session)
        }
      })
    }
  })
}
