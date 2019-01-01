import { expect } from 'chai'

import { Connection } from 'typeorm'
import { Category } from '../../entity/Category'
import { defaultUser } from '../../testHelpers/generateModels'
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../testHelpers/test-utils'
import CategoryResolver from '../../Resolvers/CategoryResolver'

describe('[Category Resolver test]', () => {
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

  it('get all categories', async () => {
    const currentUser = {}
    const categoryArg = { title: 'Category Title Just Created' }
    await connection.manager.create(Category, categoryArg).save()
    const categories = await CategoryResolver.Query.categories('', {}, { currentUser })
    expect(categories.entries.length).to.eq(1)
    expect(categories.entries[0].title).to.eq(categoryArg.title)
  })

  it('get a category by id', async () => {
    const currentUser = {}
    const categoryArg = { title: 'Category Title Just Created' }
    const createdCategory = await connection.manager.create(Category, categoryArg).save()
    const category = await CategoryResolver.Query.category('', { id: createdCategory.id }, { currentUser })
    expect(category.title).to.eq(categoryArg.title)
  })

  it('create a category when user is logged in', async () => {

    const currentUser = await defaultUser(connection)

    const categoryArg = { title: 'Category Title Just Created' }
    const category = await CategoryResolver.Mutation.createCategory('', categoryArg, { currentUser })
    expect(category.title).to.eq(categoryArg.title)
  })

  it('cannot create a category when user is not logged in', async () => {

    const currentUser = {}

    const categoryArg = { title: 'Category Title Just Created' }
    try {
      const category = await CategoryResolver.Mutation.createCategory('', categoryArg, { currentUser })
    } catch (e) {
      expect(e.message).to.match(/NOT_LOGGED_IN/)
    }

  })

})
