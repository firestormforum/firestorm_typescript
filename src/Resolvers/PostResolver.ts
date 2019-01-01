import { Post } from '../entity/Post'
import { getConnection } from 'typeorm'
import * as AuthenticationService from '../Services/AuthenticationService'
import * as GraphqlErrorHandler from '../Helpers/GraphqlErrorHandler'
import { PubSub, withFilter } from 'graphql-subscriptions'

export const pubsub = new PubSub()

export default {
  Mutation: {
    createPost: async (parent, args, { currentUser }) => {
      if (AuthenticationService.isLoggedIn(currentUser)) {
        const argsWithUserId = { ...args, userId: currentUser.id }

        let post = await getConnection().manager.create(Post, argsWithUserId).save()

        post = await Post.findOne(post.id, {
          join: {
            alias: 'post',
            leftJoinAndSelect: {
              thread: 'post.thread',
              user: 'post.user'
            }
          },
          order: { insertedAt: 'DESC' }
        })
        pubsub.publish('postAdded', { post })
        return post
      } else {
        throw new Error(GraphqlErrorHandler.errorName.NOT_LOGGED_IN)
      }
    }
  },
  Subscription: {
    postAdded: {
      resolve: (payload) => {
        return payload.post
      },
      subscribe: withFilter(() => pubsub.asyncIterator('postAdded'),
        (payload, variables) => {
          return payload.post.threadId === variables.threadId
        })
    }
  }
}
