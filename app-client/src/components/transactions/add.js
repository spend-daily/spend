import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import {
  Button,
  Card,
  Grid,
  TextField
} from 'material-ui'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import { DateTimePicker } from 'material-ui-pickers'
import uuid from 'uuid/v4'
import {
  allTransactions,
  createTransaction
} from './queries'

export class AddTransaction extends Component {
  state = {
    amount: '',
    memo: '',
    time: new Date()
  }

  updateMemo = event => {
    this.setState({ memo: event.target.value })
  }

  updateAmount = event => {
    this.setState({ amount: event.target.value })
  }

  updateDateTime = dateTime => {
    this.setState({ time: dateTime })
  }

  addTransaction() {
    const id = uuid()
    this.props.mutate({
      variables: {
        transaction: {
          transaction: {
            ...this.state,
            id
          }
        }
      },
      // TODO `optimisticUpdate`
      update: (proxy) => {
        const data = proxy.readQuery({ query: allTransactions })
        data.allTransactions.edges.push({
          node: {
            ...this.state,
            id,
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
              value={this.state.memo}
              fullWidth
              onChange={this.updateMemo}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              id="amount"
              label="amount"
              type="number"
              value={this.state.amount}
              fullWidth
              onChange={this.updateAmount}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <DateTimePicker
              autoOk
              disableFuture
              leftArrowIcon={<KeyboardArrowLeft />}
              rightArrowIcon={<KeyboardArrowRight />}
              onChange={this.updateDateTime}
              value={this.state.time}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
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
