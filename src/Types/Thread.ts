export default `
scalar DateTime

type Thread {
  id: ID!
  title: String!
  slug: String!
  category: Category
  posts: [Post]
  insertedAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  thread(id: ID!): Thread
}

type Mutation {
  createThread(title: String!, categoryId: ID!, body: String!): Thread
}

type Subscription {
  threadAdded(categoryId: ID!): Thread
}
`
