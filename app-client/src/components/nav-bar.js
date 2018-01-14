import React from 'react'
import { AppBar, Button, Toolbar, Typography } from 'material-ui'
import { NavLink, Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'

import Navigation from './navigation'

const date = new Date()
const today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

export default withStyles(theme => ({
  todayActive: {
    backgroundColor: theme.palette.primary['400']
  }
}))(({ classes, count }) => (
  <AppBar>
    <Toolbar>
      <Typography type="title" color="inherit">
        Save
      </Typography>
      <Route path="/home/*" component={Navigation} />
      <NavLink to={`/home/${today}`} activeClassName={classes.todayActive}>
        <Button color="contrast">Today</Button>
      </NavLink>
    </Toolbar>
  </AppBar>
))
