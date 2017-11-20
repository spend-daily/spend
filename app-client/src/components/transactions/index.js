import React from 'react'
import { graphql } from 'react-apollo'

import $AddTransaction from './add'
import Table from './table'
import {
  allTransactions,
} from './queries'

export function TransactionList({ data }) {
  if (data.loading) return null
  return (
    <div>
      <ul>
        <$AddTransaction />
      </ul>
      <Table data={data.allTransactions.edges.map(edge => (edge.node))} />
    </div>
  )
}

export const $TransactionList = graphql(allTransactions)(TransactionList)
