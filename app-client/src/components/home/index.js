import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import {
  $TransactionList,
  $TransactionsByTime
} from '../transactions'

export class Home extends Component {
  render() {
    return (
      <div>
        <Route path="/home" component={$TransactionList}/>
        <Route path="/home/day/:day" component={$TransactionsByTime}/>
      </div>
    )
  }
}
