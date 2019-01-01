import { User } from '../entity/User'
import { getConnection } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import * as GraphqlErrorHandler from '../Helpers/GraphqlErrorHandler'
import * as GravatarHelper from '../Helpers/GravatarHelper'

export default {
  User: {
    avatarUrl: function (user) {
      return GravatarHelper.getUrl(user.email)
    }
  },
  Query: {
    users: (parent, args, { }) =>
      User.createQueryBuilder('users')
        .leftJoinAndSelect('users.posts', 'posts')
        .orderBy('posts.insertedAt', 'DESC')
        .getMany()
  },
  Mutation: {
    createUser: async (parent, args, { }) => {
      const user = getConnection().manager.create(User, args)
      user.password = args.password
      return user.save()
    },
    authenticate: async (parent, { email, password }, { }) => {
      const user = await User.findOne({ email })
      if (user) {
        const rightPassword = await bcrypt.compare(password, user.passwordHash)
        if (rightPassword) {
          const token = jwt.sign(
            {
              userId: user.id
            },
            'server secret',
            {
              expiresIn: '7d'
            }
          )
          return token
        } else {
          throw new Error(GraphqlErrorHandler.errorName.WRONG_PASSWORD)
        }
      } else {
        throw new Error(GraphqlErrorHandler.errorName.USER_NOT_FOUND)
      }
    }
  }
}
