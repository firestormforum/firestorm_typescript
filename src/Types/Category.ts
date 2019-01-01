export default `
scalar DateTime

type Category {
  id: ID!
  title: String!
  slug: String!
  threads: [Thread]
  insertedAt: DateTime!
  updatedAt: DateTime!
}

type PaginatedCategories {
  entries: [Category]
  page: Int!
  perPage: Int!
  totalEntries: Int!
  totalPages: Int!
}

type Query {
  category(id: ID!): Category
  categories(pagination: Pagination): PaginatedCategories
}

type Mutation {
  createCategory(title: String!): Category
}

type Subscription {
  categoryAdded: Category
}
`
