import { expect } from 'chai'
import { afterEach, beforeEach } from 'mocha'
import { Connection } from 'typeorm'
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../testHelpers/test-utils'
import { Post } from '../../entity/Post'
import { defaultUser, defaultCategory, defaultThread } from '../../testHelpers/generateModels'

describe('[Post test]', () => {
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

  it('can create a post', async () => {
    const user = await defaultUser(connection)
    const category = await defaultCategory(connection)
    const thread = await defaultThread(category.id, connection)

    const post = new Post()
    post.body = 'my body'
    post.thread = thread
    post.user = user
    const createdPost = await post.save()

    expect(createdPost.id).not.to.eq(undefined)
    expect(createdPost.body).not.to.eq(undefined)
  })

})
