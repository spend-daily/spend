import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

export default withStyles(theme => ({
  sum: {
    fontSize: '1.4em'
  }
}))(({ classes, sum }) => (
  <Typography className={classes.sum} component="h3" type="headline">
    ${sum}
  </Typography>
))
