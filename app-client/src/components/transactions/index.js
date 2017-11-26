import React from 'react'
import { graphql } from 'react-apollo'
import { Route } from 'react-router'

import Table from './table'
import {
  allTransactions,
} from './queries'

export function TransactionList({ data }) {
  if (data.loading || !data.allTransactions) return null
  const transactions = data.allTransactions.edges.map(
    edge => edge.node
  )
  return (
    <div>
      <Table data={transactions} />
    </div>
  )
}

export const $TransactionList = graphql(allTransactions)(TransactionList)
