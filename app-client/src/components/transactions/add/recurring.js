import React, { Component } from 'react'
import { Button, Grid, TextField } from 'material-ui'
import Select from 'material-ui/Select'
import { withStyles } from 'material-ui/styles'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Input, { InputLabel } from 'material-ui/Input'
import { DatePicker } from 'material-ui-pickers'
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import DeleteIcon from 'material-ui-icons/Delete'
import uuid from 'uuid/v4'

class RecurringRule extends Component {
  updateStart = start => {
    this.props.update({
      ...this.props.definition,
      start
    })
  }

  updateEnd = end => {
    this.props.update({
      ...this.props.definition,
      end
    })
  }

  updateFrequency = event => {
    this.props.update({
      ...this.props.definition,
      frequency: event.target.value < 0 ? 0 : event.target.value
    })
  }

  updateUnit = event => {
    this.props.update({
      ...this.props.definition,
      unit: event.target.value
    })
  }

  deleteRule = () => {
    this.props.deleteRule(this.props.definition.id)
  }

  render() {
    return (
      <Grid container>
        <Grid item sm={3} xs={6}>
          <DatePicker
            autoOk
            fullWidth
            label="Start Date"
            leftArrowIcon={<KeyboardArrowLeft />}
            rightArrowIcon={<KeyboardArrowRight />}
            onChange={this.updateStart}
            value={this.props.definition.start}
            maxDate={this.props.definition.end}
          />
        </Grid>
        <Grid item sm={3} xs={6}>
          <DatePicker
            autoOk
            fullWidth
            label="End Date"
            leftArrowIcon={<KeyboardArrowLeft />}
            rightArrowIcon={<KeyboardArrowRight />}
            onChange={this.updateEnd}
            value={this.props.definition.end}
            minDate={this.props.definition.start}
          />
        </Grid>
        <Grid item sm={2} xs={5}>
          <TextField
            id="frequency"
            label="frequency"
            type="number"
            value={this.props.definition.frequency}
            fullWidth
            onChange={this.updateFrequency}
          />
        </Grid>
        <Grid item sm={3} xs={6}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel htmlFor="interval">Interval</InputLabel>
            <Select
              fullWidth
              value={this.props.definition.unit}
              onChange={this.updateUnit}
              input={<Input name="interval" id="interval" />}
            >
              <MenuItem value="year">Yearly</MenuItem>
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="week">Weekly</MenuItem>
              <MenuItem value="day">Daily</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl>
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={this.deleteRule}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </FormControl>
        </Grid>
      </Grid>
    )
  }
}

const style = theme => ({
  ruleList: {
    listStyle: 'none outside none',
    paddingLeft: 0
  }
})

class Recurring extends Component {
  updateRule = newRule => {
    this.props.update(
      this.props.rules.map(rule => (rule.id === newRule.id ? newRule : rule))
    )
  }

  addRule = () => {
    this.props.update([
      ...this.props.rules,
      {
        ...this.props.rules[this.props.rules.length - 1],
        id: uuid()
      }
    ])
  }

  deleteRule = id => {
    if (this.props.rules.length === 1) {
      return
    }

    this.props.update(this.props.rules.filter(rule => rule.id !== id))
  }

  render() {
    return (
      <div>
        <ul className={this.props.classes.ruleList}>
          {this.props.rules.map(rule => (
            <li key={rule.id}>
              <RecurringRule
                definition={rule}
                update={this.updateRule}
                deleteRule={this.deleteRule}
              />
            </li>
          ))}
        </ul>
        <Button raised onClick={this.addRule}>
          Add Rule
        </Button>
      </div>
    )
  }
}

export default withStyles(style)(Recurring)
