import { User } from '../entity/User'
import { Category } from '../entity/Category'
import { Thread } from '../entity/Thread'
import { Post } from '../entity/Post'

export async function defaultUser (connection) {
  const userArg = { name: 'name', username: 'username', email: 'email@example.com', password: 'password' }

  const user = connection.manager.create(User, userArg)
  user.password = userArg.password
  return user.save()
}

export async function defaultCategory (connection) {
  const categoryArg = { title: 'Category Title Just Created' }
  return connection.manager.create(Category, categoryArg).save()
}

export async function defaultThread (categoryId, connection) {
  const threadArg = { title: 'Thread title', slug: 'thread-title', categoryId }

  return connection.manager.create(Thread, threadArg).save()
}

export async function defaultPost ({ body = 'Body of my text' }, connection) {
  const category = await defaultCategory(connection)
  const thread = await defaultThread(category.id, connection)
  const user = await defaultUser(connection)

  const postArg = { body, threadId: thread.id, userId: user.id }
  return connection.manager.create(Post, postArg).save()
}
