import { Category } from '../entity/Category'
import { getConnection } from 'typeorm'
import * as GraphqlErrorHandler from '../Helpers/GraphqlErrorHandler'
import * as AuthenticationService from '../Services/AuthenticationService'
import PaginationHelper from '../Helpers/PaginationHelper'
import { slugify } from '../Helpers/SlugHelper'
import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()

export default {
  Query: {
    category: async (parent, { id }, { }) => {
      return Category.createQueryBuilder('category')
        .where(`category.id = '${id}'`)
        .leftJoinAndSelect('category.threads', 'threads')
        .leftJoinAndSelect('threads.posts', 'posts')
        .orderBy('category.insertedAt', 'DESC')
        .getOne()
    },
    categories: async (parent, args, { currentUser }) => {
      const { page, perPage, skipElements } = PaginationHelper.getProperties(args.pagination)

      const categories = Category.createQueryBuilder('category')
        .leftJoinAndSelect('category.threads', 'threads')
        .leftJoinAndSelect('threads.posts', 'posts')
        .orderBy('category.insertedAt', 'DESC')
        .skip(skipElements)
        .take(perPage)

      const { totalEntries, totalPages } = await PaginationHelper.getTotals(categories, perPage)

      return { entries: await categories.getMany(), totalEntries, page, perPage, totalPages }
    }
  },
  Mutation: {
    createCategory: (parent, args, { currentUser }) => {
      if (AuthenticationService.isLoggedIn(currentUser)) {
        const argsWithSlug = { ...args, slug: slugify(args.title) }
        const category = getConnection().manager.create(Category, argsWithSlug).save()
        pubsub.publish('categoryAdded', { category })
        return category
      } else {
        throw new Error(GraphqlErrorHandler.errorName.NOT_LOGGED_IN)
      }
    }
  },
  Subscription: {
    categoryAdded: {
      resolve: (payload) => {
        return payload.category
      },
      subscribe: () => pubsub.asyncIterator('categoryAdded')
    }
  }
}
