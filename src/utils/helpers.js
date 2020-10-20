import { format, fromUnixTime } from 'date-fns'


export const roundLatLng = (number) => {
  return Math.round(number * 100000) / 100000
}

export const formatDate = timestamp => {
  const dateString = fromUnixTime(timestamp)
  return format(new Date(dateString), 'dd.MM.yyyy')
}
