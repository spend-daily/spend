import {
  AppBar,
  Grid,
  Toolbar,
  Typography
} from 'material-ui'
import React, { Component } from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import {
  ApolloProvider
} from 'react-apollo'
import {
  ApolloClient
} from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { HistoryAuthenticate } from './components/authenticate'
import { Home } from './components/home'
import './App.css'


const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  credentials: 'include'
})

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: localStorage.getItem('token') || null
    }
  })
  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <AppBar>
                <Toolbar>
                <Typography type="title" color="inherit">
                  Save
                </Typography>
              </Toolbar>
            </AppBar>
            <Grid container alignItems="center" className="app-container">
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item>
                    <Route exact path="/" component={HistoryAuthenticate}/>
                    <Route path="/home" component={Home}/>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
