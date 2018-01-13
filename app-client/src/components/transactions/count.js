import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

export default withStyles(theme => ({
  count: {
    fontSize: '.9em'
  }
}))(({ classes, count }) => (
  <Typography className={classes.count} component="h4" type="headline">
    {count} transaction{count > 1 ? 's' : ''}
  </Typography>
))
