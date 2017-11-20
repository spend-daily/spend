import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { findIndex } from 'lodash'
import { graphql } from 'react-apollo'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import DeleteIcon from 'material-ui-icons/Delete'
import FilterListIcon from 'material-ui-icons/FilterList'

import { allTransactions, deleteTransaction } from './queries';

const columnData = [{
  id: 'id',
  numeric: false,
  label: 'ID'
}, {
  id: 'memo',
  numeric: false,
  label: 'Memo'
}, {
  id: 'amount',
  numeric: true,
  label: 'amount'
}]

class EnhancedTableHead extends React.Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  }


  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const {
      order,
      orderBy
    } = this.props

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }, this)}
          <TableCell padding="checkbox"></TableCell>
        </TableRow>
      </TableHead>
    )
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: 2,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.A700,
          backgroundColor: theme.palette.secondary.A100,
        }
      : {
          color: theme.palette.secondary.A100,
          backgroundColor: theme.palette.secondary.A700,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
})

let EnhancedTableToolbar = props => {
  const { classes } = props

  return (
    <Toolbar
      className={classNames(classes.root)}
    >
      <div className={classes.title}>
        <Typography type="title">Transactions</Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  )
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})

class DeleteButton extends React.Component {
  state = {
    isDeleting: false
  }

  handleDelete = (id) => {
    this.setState({
      isDeleting: true
    })

    this.props
      .mutate({
        variables: {
          transaction: {
            id
          }
        },
        // TODO `optimisticUpdate`
        update: (proxy) => {
          const data = proxy.readQuery({ query: allTransactions })
          const transactionIndex = findIndex(
            data.allTransactions.edges,
            transaction => transaction.node.id === id
          )

          if (transactionIndex) {
            data.allTransactions.edges.splice(transactionIndex, 1)
            proxy.writeQuery({ query: allTransactions, data })
          } else {
            console.info(`Could not optimistically remove transaction ${id}`)
          }
        }
      })
      .then(() => {
        if (this) {
          this.setState({
            isDeleting: false
          })
        }
      })
  }

  render() {
    return this.state.isDeleting
      ? <CircularProgress />
      : (
        <Tooltip title="Delete">
          <IconButton
            aria-label="Delete"
            onClick={() => this.handleDelete(this.props.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )
  }
}

const $DeleteButton = graphql(
  deleteTransaction, {
  options: (id) => ({
    variables: {
      transaction: {
        id
      }
    }
  })
})(DeleteButton)

class EnhancedTable extends React.Component {
  state = {
      order: 'asc',
      orderBy: 'amount',
      data: []
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b)=> (a[orderBy] < b[orderBy] ? -1 : 1))

    this.setState({ data, order, orderBy })
  }

  render() {
    const { classes, data } = this.props
    const { order, orderBy } = this.state
    console.log(data)

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .map(n => {
                  return (
                    <TableRow
                      hover
                      key={n.id}
                    >
                      <TableCell padding="dense">
                        {`...${n.id.substr(-5)}`}
                      </TableCell>
                      <TableCell>{n.memo}</TableCell>
                      <TableCell numeric>{n.amount}</TableCell>
                      <TableCell>
                        <$DeleteButton id={n.id} />
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(EnhancedTable)
