import React from 'react'
import { Link } from 'react-router-dom'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'
import { find } from 'lodash'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

const styles = {
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
    flex: '1 0'
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
    padding: '4px'
  }
}

const dayStyles = {
  day: {
    textDecoration: 'none'
  },
  label: {
    textAlign: 'left'
  },
  sum: {
    fontSize: '2em'
  },
  count: {
    fontSize: '1.1em'
  }
}

const Day = ({ classes, dayOfMonth, transaction, date }) => {
  return (
    <Link
      className={classes.day}
      to={`/home/${date.year}/${date.month}/${date.day}`}
    >
      <Card style={{ height: '100%' }}>
        <CardContent>
          {transaction ? (
            <div>
              <div className={classes.label}>{dayOfMonth}</div>
              <div className={classes.sum}>${transaction.sum}</div>
              <div className={classes.count}>
                {transaction.count} transaction{transaction.count > 1 ? 's' : ''}
              </div>
            </div>
          ) : (
            <div className={classes.label}>{dayOfMonth}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

const $Day = withStyles(dayStyles)(Day)

class Month extends React.Component {
  render() {
    const { classes, data, month, year } = this.props
    const daysInMonth = new Date(year, month - 1, 0).getDate()
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
                  counter < daysInMonth ? (
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
