import { expect } from 'chai'
import { afterEach, beforeEach } from 'mocha'
import { Connection } from 'typeorm'
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from '../../testHelpers/test-utils'
import { User } from '../../entity/User'

describe('[User test]', () => {
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

  it('can create a user', async () => {
    const user = new User()
    user.name = 'Josh Adams'
    user.email = 'josh@example.com'
    user.username = 'knewter'
    user.posts = []
    user.password = 'foobar'
    const createdUser = await user.save()
    expect(createdUser.id).not.to.eq(undefined)
    expect(createdUser.passwordHash).not.to.eq(undefined)
    expect(createdUser.passwordHash).not.to.eq('foobar')
  })

})
