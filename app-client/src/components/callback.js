import React from 'react'
import { Redirect } from 'react-router-dom'
import { get } from 'lodash'
import { parse } from 'query-string'

import auth0 from './authenticate/auth0'

export default props => {
  const hash = get(props, 'location.hash')

  if (hash) {
    const { id_token, token_type } = parse(hash)

    if (id_token && token_type) {
      localStorage.setItem('token', `${token_type} ${id_token}`)
      return <Redirect to="/home" />
    }
  }

  return <Redirect to="/" />
}
