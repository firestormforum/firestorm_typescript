import { Thread } from '../entity/Thread'
import { getConnection } from 'typeorm'
import * as AuthenticationService from '../Services/AuthenticationService'
import * as GraphqlErrorHandler from '../Helpers/GraphqlErrorHandler'
import { slugify } from '../Helpers/SlugHelper'
import { withFilter, PubSub } from 'graphql-subscriptions'
import { Post } from '../entity/Post'

export const pubsub = new PubSub()

export default {
  Query: {
    thread: async (parent, { id }, { }) => {
      return Thread.createQueryBuilder('thread')
      .where(`thread.id = '${id}'`)
      .leftJoinAndSelect('thread.posts', 'posts')
      .leftJoinAndSelect('thread.category', 'category')
      .leftJoinAndSelect('posts.user', 'user')
      .orderBy('posts.insertedAt', 'DESC').getOne()
    }
  },
  Mutation: {
    createThread: async (parent, args, { currentUser }) => {
      if (AuthenticationService.isLoggedIn(currentUser)) {
        const argsWithSlug = { ...args, slug: slugify(args.title) }

        let thread
        await getConnection().transaction(async () => {
          thread = await getConnection().manager.create(Thread, argsWithSlug).save()

          const argsWithUserId = { body: args.body, threadId: thread.id, userId: currentUser.id }
          await getConnection().manager.create(Post, argsWithUserId).save()

          pubsub.publish('threadAdded', { thread })
        })
        return thread
      } else {
        throw new Error(GraphqlErrorHandler.errorName.NOT_LOGGED_IN)
      }
    }
  },
  Subscription: {
    threadAdded: {
      resolve: (payload) => {
        return payload.thread
      },
      subscribe: withFilter(() => pubsub.asyncIterator('threadAdded'),
        (payload, variables) => {
          return payload.thread.categoryId === variables.categoryId
        })
    }
  }
}
