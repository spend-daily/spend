import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { Button, Grid, TextField } from 'material-ui'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import { DateTimePicker } from 'material-ui-pickers'
import uuid from 'uuid/v4'
import { createTransaction } from '../queries'
import Recurring from './recurring'

const style = theme => ({
  mutedText: {
    color: theme.palette.text.secondary
  }
})

export class AddTransaction extends Component {
  state = {
    amount: '',
    memo: '',
    time: new Date(),
    isSaving: false,
    recurringRules: []
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
      refetch: [
        'TransactionList',
        'TransactionDays',
        'TransactionMonths',
        'TransactionYears'
      ],
      update: proxy => {
        this.setState({
          isSaving: false
        })
        history.goBack()
      }
    })
  }

  toggleRecurring = (event, checked) => {
    this.setState({
      recurring: checked
    })
    if (!this.state.recurringRules.length) {
      this.addRecurringRule()
    }
  }

  addRecurringRule() {
    this.setState({
      recurringRules: [
        ...this.state.recurringRules,
        {
          start: new Date(),
          end: new Date(),
          frequency: 1,
          unit: 'week',
          id: uuid()
        }
      ]
    })
  }

  updateRecurringRules = recurringRules => {
    this.setState({
      recurringRules
    })
  }

  render() {
    const { classes, history } = this.props
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
            <Grid
              item
              xs={12}
              sm={this.state.recurring || this.state.spread ? 12 : 6}
            >
              <TextField
                id="amount"
                label="amount"
                type="number"
                value={this.state.amount}
                fullWidth
                onChange={this.updateAmount}
              />
            </Grid>
            {!this.state.recurring &&
              !this.state.spread && (
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    autoOk
                    fullWidth
                    label="time"
                    leftArrowIcon={<KeyboardArrowLeft />}
                    rightArrowIcon={<KeyboardArrowRight />}
                    onChange={this.updateDateTime}
                    value={this.state.time}
                  />
                </Grid>
              )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.spread}
                    onChange={this.toggleRecurring}
                  />
                }
                label="Recurring"
              />
              {this.state.recurring ? (
                <Recurring
                  rules={this.state.recurringRules}
                  update={this.updateRecurringRules}
                />
              ) : (
                <Typography className={classes.mutedText} component="span">
                  Repeat this transaction on the configured interval
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.spread}
                    onChange={(event, checked) =>
                      this.setState({ spread: checked })}
                  />
                }
                label="Spread"
              />
              {this.state.spread ? (
                <div>Spread!</div>
              ) : (
                <Typography className={classes.mutedText} component="span">
                  Spread the amount of this transaction across multiple days
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={history.goBack} color="primary">
            Cancel
          </Button>
          <Button color="accent" raised onClick={this.addTransaction}>
            {this.state.isSaving ? <CircularProgress /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default compose(
  withStyles(style),
  graphql(createTransaction, {
    options: props => ({
      variables: {
        transaction: {
          transaction: {
            ...props
          }
        }
      }
    })
  })
)(AddTransaction)
