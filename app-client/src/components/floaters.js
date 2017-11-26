import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import AutorenewIcon from 'material-ui-icons/Autorenew'
import Tooltip from 'material-ui/Tooltip'
import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  button: {
    marginBottom: '16px',
    marginRight: '16px'
  },
  small: {
    width: '40px',
    height: '40px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '0',
    right: '0'
  }
}

class Floaters extends React.Component {
  state = {
    open: false
  }

  closeTimeout = null

  handleMouseEnter = () => {
    clearTimeout(this.closeTimeout)
    this.setState({
      open: true
    })
  }

  handleMouseLeave = () => {
    this.closeTimeout = setTimeout(() => {
      this.setState({
        open: false
      })
    }, 300)
  }

  render() {
    const { classes } = this.props
    return (
      <div
        className={classes.container}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.state.open && 
          <Tooltip
            title="Recurring"
            placement="left"
            enterDelay={300}
          >
            <Link to="/home/add-recurring">
              <Button
                fab
                color="primary"
                aria-label="add recurring"
                className={classNames(classes.button, classes.small)}
              >
                <AutorenewIcon />
              </Button>
            </Link>
          </Tooltip>
        }
        <Tooltip
          title="Add"
          placement="left"
          enterDelay={300}
        >
        <Link to="/home/add">
          <Button
            fab
            color="primary"
            aria-label="add"
            className={classes.button}
          >
            <AddIcon />
          </Button>
        </Link>
        </Tooltip>
      </div>
    )
  }
}

export default withStyles(styles)(Floaters)
