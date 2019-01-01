import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import * as path from 'path'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import * as AuthenticationService from './Services/AuthenticationService'
import * as GraphqlErrorHandler from './Helpers/GraphqlErrorHandler'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { User } from './entity/User'
import { Category } from './entity/Category'
import { Thread } from './entity/Thread'
import { Post } from './entity/Post'

const typesArray = fileLoader(path.join(__dirname, './Types'))
const typeDefs = mergeTypes(typesArray, { all: true })
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './Resolvers')))
const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    if (req && req.headers) {
      const token = req.headers.authorization
      return AuthenticationService.getUserContextFromToken(token)
    }
  },
  formatError: err => {
    const error = GraphqlErrorHandler.getErrorCode(err.message)
    console.log(err)
    if (error.message) {
      return { message: error.message, statusCode: error.statusCode }
    }
    return { message: err.message }
  }
})

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: 'ts-forums-development',
  entities: [User, Category, Thread, Post],
  synchronize: true,
  logging: true
})
  .then(connection => {
    server.listen().then(({ url, subscriptionsUrl }) => {
      console.log(`🚀  Server ready at ${url}`)
      console.log(`🚀  Websocket Server ready at ${subscriptionsUrl}`)
    })
  })
  .catch(error => console.log(error))
