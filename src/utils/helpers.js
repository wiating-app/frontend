import { format, fromUnixTime } from 'date-fns'
import locationTypes from './locationTypes'


export const roundLatLng = (number) => {
  return Math.round(number * 100000) / 100000
}

export const formatDate = timestamp => {
  const dateString = fromUnixTime(timestamp)
  return format(new Date(dateString), 'dd.MM.yyyy')
}

export function getIconUrl(type) {
  // Fallback to HUT icon, if invalid icon type is set.
  const iconName = Object.keys(locationTypes).includes(type)
    ? type
    : 'HUT'

  return '/location-icons/' + iconName.toLowerCase() + '.svg'
}
