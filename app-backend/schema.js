export const schema = `
# All input for the 'createTransaction' mutation.
input CreateTransactionInput {
  # An arbitrary string value with no semantic meaning. Will be included in the
  # payload verbatim. May be used to track mutations by the client.
  clientMutationId: String

  # The 'Transaction' to be created by this mutation.
  transaction: TransactionInput!
}

# The output of our 'createTransaction' mutation.
type CreateTransactionPayload {
  # The exact same 'clientMutationId' that was provided in the mutation input,
  # unchanged and unused. May be used by a client to track mutations.
  clientMutationId: String

  # The 'Transaction' that was created by this mutation.
  transaction: Transaction

  # An edge for our 'Transaction'. May be used by Relay 1.
  transactionEdge(
    # The method to use when ordering 'Transaction'.
    orderBy: TransactionsOrderBy = PRIMARY_KEY_ASC
  ): TransactionsEdge

  # Our root query field type. Allows us to run any query from our mutation payload.
  query: Query
}

# A location in a connection that can be used for resuming pagination.
scalar Cursor

# A point in time as described by the [ISO
# 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
scalar Datetime

# All input for the 'deleteTransactionById' mutation.
input DeleteTransactionByIdInput {
  # An arbitrary string value with no semantic meaning. Will be included in the
  # payload verbatim. May be used to track mutations by the client.
  clientMutationId: String
  id: Uuid!
}

# All input for the 'deleteTransaction' mutation.
input DeleteTransactionInput {
  # An arbitrary string value with no semantic meaning. Will be included in the
  # payload verbatim. May be used to track mutations by the client.
  clientMutationId: String

  # The globally unique 'ID' which will identify a single 'Transaction' to be deleted.
  nodeId: ID!
}

# The output of our 'deleteTransaction' mutation.
type DeleteTransactionPayload {
  # The exact same 'clientMutationId' that was provided in the mutation input,
  # unchanged and unused. May be used by a client to track mutations.
  clientMutationId: String
  transaction: Transaction
  deletedTransactionId: ID

  # Our root query field type. Allows us to run any query from our mutation payload.
  query: Query
}

# The root mutation type which contains root level fields which mutate data.
type Mutation {
  # Creates a single 'Transaction'.
  createTransaction(
    # The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    input: CreateTransactionInput!
  ): CreateTransactionPayload

  # Updates a single 'Transaction' using its globally unique id and a patch.
  updateTransaction(
    # The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    input: UpdateTransactionInput!
  ): UpdateTransactionPayload

  # Updates a single 'Transaction' using a unique key and a patch.
  updateTransactionById(
    # The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    input: UpdateTransactionByIdInput!
  ): UpdateTransactionPayload

  # Deletes a single 'Transaction' using its globally unique id.
  deleteTransaction(
    # The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    input: DeleteTransactionInput!
  ): DeleteTransactionPayload

  # Deletes a single 'Transaction' using a unique key.
  deleteTransactionById(
    # The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    input: DeleteTransactionByIdInput!
  ): DeleteTransactionPayload
}

# An object with a globally unique 'ID'.
interface Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  nodeId: ID!
}

# Information about pagination in a connection.
type PageInfo {
  # When paginating forwards, are there more items?
  hasNextPage: Boolean!

  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean!

  # When paginating backwards, the cursor to continue.
  startCursor: Cursor

  # When paginating forwards, the cursor to continue.
  endCursor: Cursor
}

# The root query type which gives access points into the data universe.
type Query implements Node {
  # Fetches an object given its globally unique 'ID'.
  node(
    # The globally unique 'ID'.
    nodeId: ID!
  ): Node

  # Reads and enables pagination through a set of 'Transaction'.
  allTransactions(
    # The method to use when ordering 'Transaction'.
    orderBy: TransactionsOrderBy = PRIMARY_KEY_ASC

    # Read all values in the set before (above) this cursor.
    before: Cursor

    # Read all values in the set after (below) this cursor.
    after: Cursor

    # Only read the first 'n' values of the set.
    first: Int

    # Only read the last 'n' values of the set.
    last: Int

    # Skip the first 'n' values from our 'after' cursor, an alternative to cursor
    # based pagination. May not be used with 'last'.
    offset: Int

    # A condition to be used in determining which values should be returned by the collection.
    condition: TransactionCondition
  ): TransactionsConnection

  # Reads a single 'Transaction' using its globally unique 'ID'.
  transaction(
    # The globally unique 'ID' to be used in selecting a single 'Transaction'.
    nodeId: ID!
  ): Transaction
  transactionById(id: Uuid!): Transaction

  # Exposes the root query type nested one level down. This is helpful for Relay 1
  # which can only query top level fields if they are in a particular form.
  query: Query!

  # The root query type must be a 'Node' to work well with Relay 1 mutations. This just resolves to 'query'.
  nodeId: ID!
}

type Transaction implements Node {
  # A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  nodeId: ID!
  id: Uuid!
  userId: Uuid!
  memo: String
  time: Datetime
  location: String
}

# A condition to be used against 'Transaction' object types. All fields are tested
# for equality and combined with a logical ‘and.’
input TransactionCondition {
  # Checks for equality with the object’s 'id' field.
  id: Uuid

  # Checks for equality with the object’s 'userId' field.
  userId: Uuid

  # Checks for equality with the object’s 'memo' field.
  memo: String

  # Checks for equality with the object’s 'time' field.
  time: Datetime

  # Checks for equality with the object’s 'location' field.
  location: String
}

input TransactionInput {
  id: Uuid
  userId: Uuid!
  memo: String
  time: Datetime
  location: String
}

# Represents an update to a 'Transaction'. Fields that are set will be updated.
input TransactionPatch {
  id: Uuid
  userId: Uuid
  memo: String
  time: Datetime
  location: String
}

# A connection to a list of 'Transaction' values.
type TransactionsConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!

  # The count of *all* 'Transaction' you could get from the connection.
  totalCount: Int

  # A list of edges which contains the 'Transaction' and cursor to aid in pagination.
  edges: [TransactionsEdge]

  # A list of 'Transaction' objects.
  nodes: [Transaction!]
}

# A 'Transaction' edge in the connection.
type TransactionsEdge {
  # A cursor for use in pagination.
  cursor: Cursor

  # The 'Transaction' at the end of the edge.
  node: Transaction!
}

# Methods to use when ordering 'Transaction'.
enum TransactionsOrderBy {
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  NATURAL
  ID_ASC
  ID_DESC
  USER_ID_ASC
  USER_ID_DESC
  MEMO_ASC
  MEMO_DESC
  TIME_ASC
  TIME_DESC
  LOCATION_ASC
  LOCATION_DESC
}

# All input for the 'updateTransactionById' mutation.
input UpdateTransactionByIdInput {
  # An arbitrary string value with no semantic meaning. Will be included in the
  # payload verbatim. May be used to track mutations by the client.
  clientMutationId: String
  id: Uuid!

  # An object where the defined keys will be set on the 'Transaction' identified by our unique key.
  transactionPatch: TransactionPatch!
}

# All input for the 'updateTransaction' mutation.
input UpdateTransactionInput {
  # An arbitrary string value with no semantic meaning. Will be included in the
  # payload verbatim. May be used to track mutations by the client.
  clientMutationId: String

  # The globally unique 'ID' which will identify a single 'Transaction' to be updated.
  nodeId: ID!

  # An object where the defined keys will be set on the 'Transaction' identified by our globally unique 'ID'.
  transactionPatch: TransactionPatch!
}

# The output of our 'updateTransaction' mutation.
type UpdateTransactionPayload {
  # The exact same 'clientMutationId' that was provided in the mutation input,
  # unchanged and unused. May be used by a client to track mutations.
  clientMutationId: String
  transaction: Transaction

  # Our root query field type. Allows us to run any query from our mutation payload.
  query: Query
}

# A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
scalar Uuid
`
