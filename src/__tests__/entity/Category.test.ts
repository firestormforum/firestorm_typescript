import { expect } from 'chai'
import { afterEach, beforeEach } from 'mocha'
import { Connection } from 'typeorm'
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../testHelpers/test-utils'
import { Category } from '../../entity/Category'

describe('[Category test]', () => {
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

  it('can create a category', async () => {
    const category = new Category()
    category.title = 'Category Title'

    const createdCategory = await category.save()

    expect(createdCategory.id).not.to.eq(undefined)
    expect(createdCategory.title).not.to.eq(undefined)
  })

})
