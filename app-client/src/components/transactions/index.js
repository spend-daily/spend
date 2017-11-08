import gql from 'graphql-tag'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'

export function TransactionList({ data }) {
  if (data.loading) return null
  return (
    <ul>
      {
        data.allTransactions.edges.map(({ node }) => (
          <li key={node.id}>{node.memo}</li>
        ))
      }
    </ul>
  )
}

export const $TransactionList = graphql(gql`
  query AllTransactionsQuery {
    allTransactions {
      edges {
        node {
          id,
          memo,
          amount
        }
      }
    }
  } 
`)(TransactionList)
