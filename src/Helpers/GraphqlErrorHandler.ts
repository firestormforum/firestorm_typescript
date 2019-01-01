export const errorName = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  NOT_LOGGED_IN: 'NOT_LOGGED_IN'
}

export const errorType = {
  NOT_LOGGED_IN: {
    message: 'You must be logged in to perform this action.',
    statusCode: 401
  },
  USER_NOT_FOUND: {
    message: 'User was not found.',
    statusCode: 404
  },
  WRONG_PASSWORD: {
    message: 'Wrong Password.',
    statusCode: 403
  }
}

export const getErrorCode = errorName => {
  if (errorType[errorName]) {
    return errorType[errorName]
  } else {
    return errorName
  }
}
