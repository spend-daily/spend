import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'

AWS.config.region = 'us-west-2'

const poolData = {
  UserPoolId: 'us-west-2_F9kcsYhXB',
  ClientId: '5l3l9ns71bsgsoic4b5kujj3rh'
}
const userPool = new CognitoUserPool(poolData)

export async function register({ email, password }) {
  return new Promise((resolve, reject) => {
    let attributeList = [
      new CognitoUserAttribute({
        Name : 'email',
        Value : email
      })
    ]
    
    // sign the user up!
    userPool.signUp(email, password, attributeList, null, (error, result) => {
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

export async function login({ email, password }) {
  return new Promise((resolve, reject) => {
    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.authenticateUser(
      new AuthenticationDetails({
        Username: email,
        Password: password
      }),
      {
        onSuccess: (result) => {
          localStorage.setItem(
            'token',
            result.idToken.jwtToken
          )
          localStorage.setItem(
            'refresh',
            result.refreshToken.token
          )
          resolve()
        },
        onFailure: reject
      }
    )
  })
}
