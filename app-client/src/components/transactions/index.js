import React from 'react'
import { graphql } from 'react-apollo'
import { Route } from 'react-router'

import Table from './table'
import {
  allTransactions,
} from './queries'

export function TransactionList({ data }) {
  if (data.loading || !data.allTransactions) return null
  return (
    <div>
      <Table data={data.allTransactions.edges.map(edge => (edge.node))} />
    </div>
  )
}

export const $TransactionList = graphql(allTransactions)(TransactionList)
