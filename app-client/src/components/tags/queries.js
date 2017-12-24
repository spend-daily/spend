import gql from 'graphql-tag'

export const allTags = gql`
  query AllTags {
    allTags {
      edges {
        node {
          id
          label
        }
      }
    }
  }
`

export const createTag = gql`
  mutation createTag($tag: CreateTagInput!) {
    createTag(input: $tag) {
      tag {
        label
      }
    }
  }
`

export const transactionTags = gql`
  query transactionTags($condition: TransactionTagCondition) {
    allTransactionTags(condition: $condition) {
      edges {
        node {
          tag: tagByTagId {
            id
            label
          }
        }
      }
    }
  }
`

export const createTransactionTag = gql`
  mutation createTransactionTag($transactionTag: CreateTransactionTagInput!) {
    createTransactionTag(input: $transactionTag) {
      transactionTag {
        tagId
        transactionId
      }
    }
  }
`

export const deleteTransactionTag = gql`
  mutation deleteTransactionTag(
    $transactionTag: DeleteTransactionTagByTransactionIdAndTagIdInput!
  ) {
    deleteTransactionTagByTransactionIdAndTagId(input: $transactionTag) {
      transactionTag {
        tagId
        transactionId
      }
    }
  }
`
