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

export const transactionList = gql`
  query TransactionList($condition: TransactionListCondition) {
    allTransactionLists(condition: $condition) {
      edges {
        node {
          id
          amount
          memo
          time
          tags
        }
      }
    }
  }
`

export const transactionDays = gql`
  query TransactionDays($condition: TransactionDayCondition) {
    allTransactionDays(condition: $condition) {
      edges {
        node {
          year
          month
          day
          sum
          count
        }
      }
    }
  }
`

export const transactionMonths = gql`
  query TransactionMonths($condition: TransactionMonthCondition) {
    allTransactionMonths(condition: $condition) {
      edges {
        node {
          year
          month
          sum
          count
        }
      }
    }
  }
`

export const transactionYears = gql`
  query TransactionYears($condition: TransactionYearCondition) {
    allTransactionYears(condition: $condition) {
      edges {
        node {
          year
          sum
          count
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
