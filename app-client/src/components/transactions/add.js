import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import {
  Button,
  Grid,
  TextField
} from 'material-ui'
import { CircularProgress } from 'material-ui/Progress'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
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
    time: new Date(),
    isSaving: false
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

  addTransaction = () => {
    const { history } = this.props
    const { amount, memo, time } = this.state
    const transaction = {
      id: uuid(),
      amount,
      memo,
      time
    }
    this.setState({
      isSaving: true
    })
    this.props.mutate({
      variables: {
        transaction: {
          transaction
        }
      },
      update: (proxy) => {
        const data = proxy.readQuery({ query: allTransactions })
        data.allTransactions.edges.push({
          node: {
            ...transaction,
            __typename: 'Transaction'
          },
          __typename: 'TransactionsEdge'
        })
        proxy.writeQuery({ query: allTransactions, data })
        this.setState({
          isSaving: false
        })
        history.goBack()
      }
    })
  }

  render() {
    const { history } = this.props
    return (
      <Dialog open onRequestClose={history.goBack}>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                id="memo"
                label="memo"
                value={this.state.memo}
                fullWidth
                onChange={this.updateMemo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="amount"
                label="amount"
                type="number"
                value={this.state.amount}
                fullWidth
                onChange={this.updateAmount}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                autoOk
                disableFuture
                fullWidth
                label="time"
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                onChange={this.updateDateTime}
                value={this.state.time}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={history.goBack} color="primary">
            Cancel
          </Button>
          <Button
            color="accent"
            raised
            onClick={this.addTransaction}>
            {this.state.isSaving
                ? <CircularProgress />
                : 'Add'
            }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(createTransaction, {
  options: (props) => ({
    variables: {
      transaction: {
        transaction: {
          ...props
        }
      }
    }
  })
})(AddTransaction)
