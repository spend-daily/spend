import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import {
  $AllTransactionList,
  $TransactionList,
  $TransactionMonth
} from '../transactions'

export class Home extends Component {
  render() {
    return (
      <Switch>
        <Route path="/home/:year/:month/:day" component={$TransactionList}/>
        <Route path="/home/:year/:month" component={$TransactionMonth} />
        <Route path="/home/:year" />
        <Route path="/home" component={$AllTransactionList}/>
      </Switch>
    )
  }
}
