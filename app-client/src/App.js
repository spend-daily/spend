import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { HistoryAuthenticate } from './components/authenticate'
import { refresh } from './components/authenticate/cognito'
import auth0 from './components/authenticate/auth0'
import { Home } from './components/home'
import Callback from './components/callback'
import $AddTransaction from './components/transactions/add'
import Floaters from './components/floaters'
import NavBar from './components/nav-bar'
import './App.css'

refresh()

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new ApolloLink((operation, forward) => {
      const token = localStorage.getItem('token')
      operation.setContext({
        headers: {
          Authorization: token || null
        }
      })
      return forward(operation)
    }),
    new HttpLink({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
    })
  ])
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <NavBar />
            <Route exact path="/" component={HistoryAuthenticate} />
            <Route path="/callback" component={Callback} />
            <Route path="/home" component={Home} />
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
