import React from 'react'
import { graphql } from 'react-apollo'

import Table from './table'
import Month from './month'
import { allTransactions, transactionList, transactionDays } from './queries'

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
