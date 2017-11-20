import gql from 'graphql-tag'

export const allTransactions = gql`
  query AllTransactions {
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
`

export const createTransaction = gql`
  mutation createTransaction($transaction: CreateTransactionInput!) {
    createTransaction(input: $transaction) {
      transaction {
        id
        __typename
        memo
        amount
      }
    }
  }
`

export const deleteTransaction = gql`
  mutation deleteTransaction($transaction: DeleteTransactionByIdInput!) {
    deleteTransactionById(input: $transaction) {
      transaction {
        id
        __typename
      }
    }
  }
`
