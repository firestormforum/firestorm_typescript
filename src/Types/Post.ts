export default `
scalar DateTime

type Post {
  id: ID!
  body: String!
  thread: Thread
  user: User
  insertedAt: DateTime!
  updatedAt: DateTime!
}

type Mutation {
  createPost(body: String!, threadId: ID!): Post
}

type Subscription {
  postAdded(threadId: ID!): Post
}
`
