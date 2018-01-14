import React from 'react'
import { Button } from 'material-ui'
import { Link, Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'

const monthMap = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const Year = props => (
  <Link to={`/home/${props.match.params.year}`}>
    <Button color="contrast">{props.match.params.year}</Button>
  </Link>
)
const Month = props => (
  <Link to={`/home/${props.match.params.year}/${props.match.params.month}`}>
    <Button color="contrast">{monthMap[props.match.params.month - 1]}</Button>
  </Link>
)

export default withStyles(theme => ({
  container: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    flex: '1',
    textAlign: 'left'
  }
}))(props => (
  <div className={props.classes.container}>
    <Route path="/home/:year/:month" component={Year} />
    <Route path="/home/:year/:month/:day" component={Month} />
  </div>
))
