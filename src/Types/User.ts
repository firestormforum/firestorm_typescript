export default `
scalar DateTime

type User {
  id: ID!
  email: String!
  name: String!
  username: String!
  avatarUrl: String!
  posts: [Post]
  insertedAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  users: [User]
}

type Mutation {
  createUser(name: String!, username: String!, email: String!, password: String!): User
  authenticate(email: String!, password: String!) : String
}
`
