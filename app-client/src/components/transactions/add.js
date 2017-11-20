import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import {
  Button,
  Card,
  Grid,
  TextField
} from 'material-ui'
import uuid from 'uuid/v4'
import {
  allTransactions,
  createTransaction
} from './queries'

export class AddTransaction extends Component {
  state = {}

  updateMemo = event => {
    this.setState({
      memo: event.target.value
    })
  }

  updateAmount = event => {
    this.setState({
      amount: event.target.value
    })
  }

  addTransaction() {
    const id = uuid()
    const { amount, memo } = this.state
    this.props.mutate({
      variables: {
        transaction: {
          transaction: {
            id,
            amount,
            memo
          }
        }
      },
      // TODO `optimisticUpdate`
      update: (proxy) => {
        const data = proxy.readQuery({ query: allTransactions })
        data.allTransactions.edges.push({
          node: {
            id,
            memo,
            amount,
            __typename: 'Transaction'
          },
          __typename: 'TransactionsEdge'
        })
        proxy.writeQuery({ query: allTransactions, data })
      }
    })
  }

  render() {
    return (
      <Card className="authentication-container">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <TextField
              id="memo"
              label="memo"
              value={this.state.memo || ''}
              fullWidth
              onChange={this.updateMemo}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id="amount"
              label="amount"
              type="number"
              value={this.state.amount || ''}
              fullWidth
              onChange={this.updateAmount}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              color="primary"
              raised
              onClick={() => this.addTransaction()}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Card>
    )
  }
}

export default graphql(createTransaction, {
  options: ({ memo, amount }) => ({
    variables: {
      transaction: {
        transaction: {
          memo: memo,
          amount: amount
        }
      }
    }
  })
})(AddTransaction)
