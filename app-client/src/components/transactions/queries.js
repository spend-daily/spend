import gql from 'graphql-tag'

export const allTransactions = gql`
  query AllTransactions {
    allTransactions {
      edges {
        node {
          id
          memo
          amount
          time
        }
      }
    }
  }
`

export const allTransactionsByTime = gql`
  query AllTransactionsByTime($condition: TransactionsByTimeCondition) {
    allTransactionsByTime(condition: $condition) {
      edges {
        node {
          id
          memo
          amount
          time
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
        memo
        amount
        time
      }
    }
  }
`

export const deleteTransaction = gql`
  mutation deleteTransaction($transaction: DeleteTransactionByIdInput!) {
    deleteTransactionById(input: $transaction) {
      transaction {
        id
      }
    }
  }
`
