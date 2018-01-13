import React from 'react'
import { graphql } from 'react-apollo'
import { keyBy } from 'lodash'

import Table from './table'
import Month from './month'
import Year from '../year'
import {
  allTransactions,
  transactionList,
  transactionDays,
  transactionMonths
} from './queries'

export const $AllTransactionList = graphql(allTransactions)(({ data }) => {
  if (data.loading || !data.allTransactions) return null
  const transactions = data.allTransactions.edges.map(edge => edge.node)
  return <Table data={transactions} />
})

export const $TransactionList = graphql(transactionList, {
  name: 'transactionList',
  options: ({ match: { params: { year, month, day } } }) => ({
    variables: {
      condition: {
        day: `${year}-${month}-${day}`
      }
    }
  })
})(({ transactionList }) => {
  if (transactionList.loading || !transactionList.allTransactionLists)
    return null
  const transactions = transactionList.allTransactionLists.edges.map(edge => ({
    ...edge.node,
    tags: JSON.parse(edge.node.tags)
  }))
  return <Table data={transactions} refetch={transactionList.refetch} />
})

export const $TransactionMonth = graphql(transactionDays, {
  options: ({ match: { params: { year, month } } }) => ({
    variables: {
      condition: {
        year,
        month
      }
    }
  })
})(({ data, match }) => {
  if (data.loading || !data.allTransactionDays) return null
  const transactions = data.allTransactionDays.edges.map(edge => edge.node)
  return <Month data={transactions} {...match.params} />
})

export const $TransactionYear = graphql(transactionMonths, {
  options: ({ match: { params: { year } } }) => ({
    variables: {
      condition: {
        year
      }
    }
  })
})(({ data, match }) => {
  if (data.loading || !data.allTransactionMonths) return null
  const transactions = keyBy(
    data.allTransactionMonths.edges.map(edge => edge.node),
    'month'
  )
  return <Year data={transactions} {...match.params} />
})
