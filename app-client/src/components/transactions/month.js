import React from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import { find } from 'lodash'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const styles = {
  monthContainer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    height: '100%'
  },
  dayNames: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  dayName: {
    flex: '1 0'
  },
  month: {
    display: 'flex',
    flexFlow: 'column nowrap',
    flex: '1 0',
  },
  week: {
    display: 'flex',
    flexFlow: 'row nowrap',
    flex: '1 0'
  },
  day: {
    flex: '1 0',
    border: '1px solid black'
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

const Day = ({ classes, dayOfMonth, transaction }) => {
  if (transaction) {
    return (
      <Link
        className={classes.day}
        to={`/home/${transaction.year}/${transaction.month}/${transaction.day}`}
      >
        <div className={classes.label}>{dayOfMonth}</div>
        <div className={classes.sum}>${transaction.sum}</div>
        <div className={classes.count}>{transaction.count} transaction{transaction.count > 1 ? 's' : ''}</div>
      </Link>
    )
  }
  
  return (
    <div>
      <div className={classes.label}>{dayOfMonth}</div>
    </div>
  )
}

const $Day = withStyles(dayStyles)(Day)

class Month extends React.Component {
  render() {
    const { classes, data, month, year } = this.props
    const daysInMonth = new Date(year, (month - 1), 0).getDate()
    const firstDayOfWeek = new Date(year, (month - 1), 1).getDay()
    const weeks = new Array(
      Math.ceil((daysInMonth + firstDayOfWeek) / 7)
    ).fill(null)
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
            <div
              key={`week-${weekIndex}`}
              className={classes.week}
            >
              {days.map((day, dayIndex) => (
                <div
                  key={`week-${weekIndex}-day-${dayIndex}`}
                  className={classes.day}
                >
                  {(weekIndex || dayIndex >= firstDayOfWeek) && counter < daysInMonth
                    ? <$Day
                        dayOfMonth={counter++}
                        transaction={find(data, { day: counter - 1 })}
                      />
                    : null
                  }
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
