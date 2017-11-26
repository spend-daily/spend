import {
  AppBar,
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
import { refresh } from './components/authenticate/cognito'
import { Home } from './components/home'
import $AddTransaction from './components/transactions/add'
import Floaters from './components/floaters'
import './App.css'

refresh()

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
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
            <Route exact path="/" component={HistoryAuthenticate} />
            <Route path="/home" component={Home}/>
            <Route path="/home/add" component={$AddTransaction} />
            <Route path="/home/add-recurring" component={$AddTransaction} />
            <Floaters />
          </div>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
