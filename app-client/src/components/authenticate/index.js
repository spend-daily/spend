import {
  Button,
  Card,
  FormControl,
  Grid,
  TextField
} from 'material-ui'
import React, { Component } from 'react'
import queryString from 'query-string'

import {
  login,
  register
} from './cognito'
import './style.css'

export class Authenticate extends Component {
  render() {
    return (
      <Card className="authentication-container">
        <Grid container>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="email"
                label="email"
                margin="normal"
                onChange={this.props.onEmailChange}
                value={this.props.email || ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="password"
                label="password"
                type="password"
                autoComplete="current-password"
                onChange={this.props.onPasswordChange}
                value={this.props.password || ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Button
                color="accent"
                onClick={this.props.onRegister}
              >
                Register
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Button
                raised
                color="primary"
                type="submit"
                onClick={this.props.onLogin}
              >
                Login
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
    )
  }
}

export class HistoryAuthenticate extends Component {
  state = {
    
  }

  buildCredentials() {
    return {
      email: queryString.parse(this.props.location.search).email,
      password: this.state.password
    }
  }

  onEmailChange = (event) => {
    this.props.history.push({
      search: `?email=${event.target.value}`
    })
  }

  clearEmail() {
    this.props.history.push({
      search: ''
    })
  }

  onPasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  onRegister = async (event) => {
    try {
      await register(this.buildCredentials())
      this.props.history.push({
        pathname: '/registered',
        search: ''
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  onLogin = async (event) => {
    try {
      await login(this.buildCredentials())
      this.props.history.push({
        pathname: '/home',
        search: ''
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  render() {
    const {
      email
    } = queryString.parse(this.props.location.search)

    return (
      <Authenticate
        onEmailChange={this.onEmailChange}
        email={email}
        onPasswordChange={this.onPasswordChange}
        password={this.state.password}
        onRegister={this.onRegister}
        onLogin={this.onLogin}
      />
    )
  }
}
