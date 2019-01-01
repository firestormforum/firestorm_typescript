import PostResolver from '../../Resolvers/PostResolver'
import { Category } from '../../entity/Category'
import { Post } from '../../entity/Post'
import { expect } from 'chai'
import { createTestingConnections, reloadTestingDatabases, closeTestingConnections } from '../../testHelpers/test-utils'
import { Connection } from 'typeorm'

import { afterEach, beforeEach } from 'mocha'
import { User } from '../../entity/User'
import { Thread } from '../../entity/Thread'
import { defaultUser, defaultCategory, defaultPost, defaultThread } from '../../testHelpers/generateModels'

describe('[Post Resolver test]', () => {
  let connection: Connection
  beforeEach(
    async () =>
      (connection = await createTestingConnections({
        entities: ['src/entity/**/*.ts'],
        enabledDrivers: ['postgres'],
        dropSchema: true
      }))
  )
  beforeEach(() => reloadTestingDatabases(connection))
  afterEach(() => closeTestingConnections(connection))

  it('creates a post when user is logged in', async () => {
    const currentUser = await defaultUser(connection)
    const category = await defaultCategory(connection)
    const thread = await defaultThread(category.id, connection)

    const postArg = { body: 'Body of my post', threadId: thread.id }
    const post = await PostResolver.Mutation.createPost('', postArg, { currentUser })
    expect(post.body).to.eq(postArg.body)
  })

  it('does not create a post when user is not logged in', async () => {
    const currentUser = {}
    const category = await defaultCategory(connection)
    const thread = await defaultThread(category.id, connection)

    const postArg = { body: 'Body of my post', threadId: thread.id }
    try {
      const category = await PostResolver.Mutation.createPost('', postArg, { currentUser })
    } catch (e) {
      expect(e.message).to.match(/NOT_LOGGED_IN/)
    }

  })
})
