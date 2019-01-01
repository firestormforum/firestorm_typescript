import { expect } from 'chai'
import { createTestingConnections, reloadTestingDatabases, closeTestingConnections } from '../../testHelpers/test-utils'
import { Connection } from 'typeorm'

import { afterEach, beforeEach } from 'mocha'
import ThreadResolver from '../../Resolvers/ThreadResolver'
import { defaultUser, defaultCategory } from '../../testHelpers/generateModels'
import { Thread } from '../../entity/Thread'

describe('[Thread Resolver test]', () => {
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

  it('gets a thread by id', async () => {
    const category = await defaultCategory(connection)

    const currentUser = { email: 'email@example.com' }
    const threadArg = { title: 'Thread title', slug: 'thread-title', categoryId: category.id }

    const createdThread = await connection.manager.create(Thread, threadArg).save()
    const thread = await ThreadResolver.Query.thread('', { id: createdThread.id }, { currentUser })

    expect(thread.title).to.eq(threadArg.title)
  })

  it('creates a thread when user is logged in', async () => {

    const category = await defaultCategory(connection)

    const currentUser = await defaultUser(connection)
    const threadArg = { title: 'Thread title', slug: 'thread-title', categoryId: category.id, body: 'Body of my post' }

    const thread = await ThreadResolver.Mutation.createThread('', threadArg, { currentUser })
    expect(thread.title).to.eq(threadArg.title)
  })

  it('does not create a thread when user is not logged in', async () => {
    const category = await defaultCategory(connection)

    const currentUser = await defaultUser(connection)
    const threadArg = { title: 'Thread title', slug: 'thread-title', categoryId: category.id, body: 'Body of my post' }

    try {
      const thread = await ThreadResolver.Mutation.createThread('', threadArg, { currentUser })
    } catch (e) {
      expect(e.message).to.match(/NOT_LOGGED_IN/)
    }
  })

})
