/**
 * function to crop an image
 * @param url the url of the image to change to a new url to not be cached
 */

export const imageUpdater = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}${new Date().getTime()}`
