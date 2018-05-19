import auth0 from 'auth0-js'

export default new auth0.WebAuth({
  domain: 'spend.auth0.com',
  clientID: '6oBKn9IQroFqLxrTkv9xsked0ieV3axo',
  redirectUri: 'http://localhost:3000/callback',
  audience: 'https://spend.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile email'
})
