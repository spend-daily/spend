import React from 'react'
import { Link } from 'react-router-dom'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { find } from 'lodash'

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

const styles = theme => ({
  year: {
    display: 'flex',
    flexFlow: 'row wrap',
    height: '100%'
  }
})

const Month = withStyles(theme => ({
  month: {
    flex: '1 calc(100vw / 4)',
    margin: theme.spacing.unit / 2
  },
  monthCard: {
    height: '100%'
  },
  monthName: {
    color: theme.palette.text.secondary
  }
}))(({ classes, year, month }) => (
  <Link to={`/home/${year}/${month}`} className={classes.month}>
    <Card key={month} className={classes.monthCard}>
      <CardContent>
        <Typography className={classes.monthName} component="h3">
          {months[month - 1]}
        </Typography>
      </CardContent>
    </Card>
  </Link>
))

class Year extends React.Component {
  render() {
    const { classes, match } = this.props

    return (
      <div className={classes.year}>
        {months.map((_, index) => (
          <Month key={index} year={match.params.year} month={index + 1} />
        ))}
      </div>
    )
  }
}

export default withStyles(styles)(Year)
