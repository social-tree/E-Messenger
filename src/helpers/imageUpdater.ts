export const imageUpdater = (url: string) =>
  `${url}${url.includes('?') ? '&' : '?'}${new Date().getTime()}`
