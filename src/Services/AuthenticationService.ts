import * as jwt from 'jsonwebtoken'
import { User } from '../entity/User'

export const getUserContextFromToken = async (token: String) => {
  if (token === 'undefined' || !token) {
    return { currentUser: null }
  } else {
    let userId
    token = token.replace('Bearer ', '')

    try {
      let decoded = jwt.verify(token, 'server secret')
      userId = decoded.userId
    } catch (err) {
      console.error(err)
    }

    if (userId) {
      let currentUser = await User.findOne(userId)
      return { currentUser }
    } else {
      return { currentUser: null }
    }
  }
}

export const isLoggedIn = currentUser => {
  return currentUser && currentUser.id && currentUser.email
}
