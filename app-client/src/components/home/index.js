import React, { Component } from 'react'

import { $TransactionList } from '../transactions'

export class Home extends Component {
  render() {
    return (
      <div>
        <$TransactionList />
      </div>
    )
  }
}
