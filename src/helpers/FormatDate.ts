export const FormatDate = (date: string, type: string) => {
  console.log(`${new Date(date).getUTCHours()}:${new Date(date).getMinutes()}`)
  switch (type) {
    case 'hour':
      const hour = new Date(date).getUTCHours()
      const minutes = new Date(date).getMinutes()
      return `${hour}:${minutes < 10 ? `0${minutes}` : minutes}
      ${hour > 12 ? 'PM' : 'AM'}
      `
      break
    default:
      return `${new Date(date)}`
  }
}
