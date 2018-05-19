import { Button, Card, FormControl, Grid, TextField } from 'material-ui'
import React, { Component } from 'react'

import auth0 from './auth0'
import './style.css'

export class Authenticate extends Component {
  render() {
    return (
      <Card className="authentication-container">
        <Grid container>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="name"
                label="name"
                margin="normal"
                onChange={this.props.onNameChange}
                value={this.props.name || ''}
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
              <Button color="accent" onClick={this.props.onRegister}>
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
    email: '',
    password: ''
  }

  onNameChange = event => {
    this.setState({
      email: event.target.value
    })
  }

  onPasswordChange = event => {
    this.setState({
      password: event.target.value
    })
  }

  onRegister = async event => {
    auth0.signup(
      {
        ...this.state,
        connection: 'Username-Password-Authentication'
      },
      (error, data) => {
        if (error) {
          console.error(error)
        } else {
          console.log(data)
        }
      }
    )
  }

  onLogin = event => {
    auth0.popup.loginWithCredentials(
      {
        ...this.state,
        realm: 'Username-Password-Authentication'
      },
      (error, result) => {
        console.log(error, result)
      }
    )
  }

  render() {
    return (
      <Grid container alignItems="center" className="app-container">
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item>
              <Authenticate
                onNameChange={this.onNameChange}
                name={this.state.email}
                onPasswordChange={this.onPasswordChange}
                password={this.state.password}
                onRegister={this.onRegister}
                onLogin={this.onLogin}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
