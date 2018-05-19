import React from 'react'
import { Link } from 'react-router-dom'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { find } from 'lodash'

import Count from './count'
import Sum from './sum'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

const styles = theme => ({
  monthContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    height: '100%'
  },
  dayNames: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  dayName: {
    flex: '1 0',
    color: theme.palette.text.secondary,
    padding: `.5vw 0 0`,
    fontSize: '2vw'
  },
  month: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flex: '1 0'
  },
  week: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flex: '1 0'
  },
  day: {
    flex: '1 0',
    margin: '2px',
    width: `${100 / 7}%`
  }
})

const dayStyles = theme => ({
  label: {
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  dayContent: {
    overflow: 'auto'
  },
  dayContainer: {
    padding: `${theme.spacing.unit}px`
  }
})

const Day = ({ classes, dayOfMonth, transaction, date }) => (
  <Link
    className={classes.day}
    to={`/home/${date.year}/${date.month}/${date.day}`}
  >
    <Card style={{ height: '100%' }}>
      <CardContent className={classes.dayContainer}>
        <Typography className={classes.label}>{dayOfMonth}</Typography>
        {transaction && (
          <div className={classes.dayContent}>
            <Sum sum={transaction.sum} />
            <Count count={transaction.count} />
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
)

const $Day = withStyles(dayStyles)(Day)

class Month extends React.Component {
  render() {
    const { classes, data, month, year } = this.props
    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
    const weeks = new Array(Math.ceil((daysInMonth + firstDayOfWeek) / 7)).fill(
      null
    )
    let counter = 1

    return (
      <div className={classes.monthContainer}>
        <div className={classes.dayNames}>
          {days.map((day, dayIndex) => (
            <div className={classes.dayName} key={`day-${dayIndex}`}>
              {day}
            </div>
          ))}
        </div>
        <div className={classes.month}>
          {weeks.map((_, weekIndex) => (
            <div key={`week-${weekIndex}`} className={classes.week}>
              {days.map((day, dayIndex) => (
                <div
                  key={`week-${weekIndex}-day-${dayIndex}`}
                  className={classes.day}
                >
                  {(weekIndex || dayIndex >= firstDayOfWeek) &&
                  counter <= daysInMonth ? (
                    <$Day
                      dayOfMonth={counter++}
                      transaction={find(data, { day: counter - 1 })}
                      date={{ day: counter - 1, month, year }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Month)
