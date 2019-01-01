import { expect } from 'chai'
import { afterEach, beforeEach } from 'mocha'
import { Connection } from 'typeorm'
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../testHelpers/test-utils'
import { Thread } from '../../entity/Thread'
import { defaultCategory } from '../../testHelpers/generateModels'

describe('[Thread test]', () => {
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

  it('can create a thread', async () => {
    const category = await defaultCategory(connection)

    const thread = new Thread()
    thread.title = 'Some title'
    thread.slug = 'some-title'
    thread.category = category
    const createdCategory = await thread.save()

    expect(createdCategory.id).not.to.eq(undefined)
    expect(createdCategory.slug).not.to.eq(undefined)
  })
})
