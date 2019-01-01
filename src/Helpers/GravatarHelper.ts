import * as md5 from 'js-md5'

export const getUrl = (email: string): string => {
  const hash = md5(email)
  return `https://www.gravatar.com/avatar/${hash}`
}
