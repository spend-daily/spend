import React from 'react'
import { graphql } from 'react-apollo'
import { Route } from 'react-router'
import queryString from 'query-string'

import Table from './table'
import {
  allTransactions,
  allTransactionsByTime
} from './queries'

export function TransactionList({ data }) {
  if (data.loading || !data.allTransactions) return null
  const transactions = data.allTransactions.edges.map(
    edge => edge.node
  )
  return (
    <Table data={transactions} />
  )
}

export const $TransactionList = graphql(allTransactions)(TransactionList)

export const $TransactionsByTime = graphql(allTransactionsByTime, {
  options: (props) => ({
    variables: {
      condition: {
        day: props.match.params.day
      }
    }
  })
})(({ data }) => {
  if (data.loading || !data.allTransactionsByTime) return null
  const transactions = data.allTransactionsByTime.edges.map(
    edge => edge.node
  )
  return (
    <Table data={transactions} />
  )
})
