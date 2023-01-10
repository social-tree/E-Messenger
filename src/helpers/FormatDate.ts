/**
 * format the date to what you need
 * @param date the date to format
 * @param type the type of formating thats needed
 */

export const FormatDate = (date: string, type: string) => {
  switch (type) {
    case 'hour':
      const hour = new Date(date).getUTCHours()
      const minutes = new Date(date).getMinutes()
      return `${hour}:${minutes < 10 ? `0${minutes}` : minutes}
      ${hour > 12 ? 'PM' : 'AM'}
      `
    default:
      return `${new Date(date)}`
  }
}
