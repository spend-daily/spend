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
  TableSortLabel
} from 'material-ui/Table'
import { CircularProgress } from 'material-ui/Progress'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import DeleteIcon from 'material-ui-icons/Delete'
import AccessTime from 'material-ui-icons/AccessTime'
import AttachMoney from 'material-ui-icons/AttachMoney'
import Time from 'react-time'

import Tags from '../tags'
import { allTransactions, deleteTransaction } from './queries'

const columnData = [
  {
    id: 'id',
    label: 'ID'
  },
  {
    id: 'memo',
    label: 'Memo'
  },
  {
    id: 'tags',
    label: 'Tags'
  },
  {
    id: 'amount',
    numeric: true,
    label: <AttachMoney />
  },
  {
    id: 'time',
    label: <AccessTime />
  }
]

class EnhancedTableHead extends React.Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { order, orderBy } = this.props

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
          <TableCell padding="checkbox" />
        </TableRow>
      </TableHead>
    )
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: 2
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.A700,
          backgroundColor: theme.palette.secondary.A100
        }
      : {
          color: theme.palette.secondary.A100,
          backgroundColor: theme.palette.secondary.A700
        },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
})

let EnhancedTableToolbar = props => {
  const { classes } = props

  return (
    <Toolbar className={classNames(classes.root)}>
      <div className={classes.title}>
        <Typography type="title">Transactions</Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions} />
    </Toolbar>
  )
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto'
  }
})

class DeleteButton extends React.Component {
  state = {
    isDeleting: false
  }

  handleDelete = id => {
    this.setState({
      isDeleting: true
    })

    this.props.mutate({
      variables: {
        transaction: {
          id
        }
      },
      update: proxy => {
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

        this.setState({
          isDeleting: false
        })
      }
    })
  }

  render() {
    return this.state.isDeleting ? (
      <CircularProgress />
    ) : (
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

const $DeleteButton = graphql(deleteTransaction, {
  options: id => ({
    variables: {
      transaction: {
        id
      }
    }
  })
})(DeleteButton)

class EnhancedTable extends React.Component {
  state = {
    order: 'desc',
    orderBy: 'time'
  }

  getSortedData() {
    const { order, orderBy } = this.state
    return order === 'desc'
      ? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({
      order,
      orderBy
    })
  }

  render() {
    const { classes } = this.props
    const { order, orderBy } = this.state

    const data = this.getSortedData()

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
              {data.map(transaction => {
                return (
                  <TableRow hover key={transaction.id}>
                    <TableCell padding="dense">
                      {`...${transaction.id.substr(-7)}`}
                    </TableCell>
                    <TableCell>{transaction.memo}</TableCell>
                    <TableCell padding="dense">
                      <Tags transactionId={transaction.id} />
                    </TableCell>
                    <TableCell numeric padding="dense">
                      {transaction.amount}
                    </TableCell>
                    <TableCell padding="dense">
                      <Time
                        format="MM/DD/YY hh:mm"
                        titleFormat="MM/DD/YY hh:mm"
                        relative={
                          new Date().toDateString() ===
                          new Date(transaction.time).toDateString()
                        }
                        value={transaction.time}
                      />
                    </TableCell>
                    <TableCell padding="dense">
                      <$DeleteButton id={transaction.id} />
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
