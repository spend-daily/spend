import React from 'react'
import { Button } from 'material-ui'
import { Link, Route } from 'react-router-dom'

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

export default props => (
  <div>
    <Route path="/home/:year/:month" component={Year} />
    <Route path="/home/:year/:month/:day" component={Month} />
  </div>
)
