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

export function parseCoordinates(input) {
  var [lat, lon] = input.split(/[,\s]+/)

  lat = (isFinite(+lat)) ? Number(lat) : lat
  lon = (isFinite(+lon)) ? Number(lon) : lon

  if (typeof (lat) === typeof (lon)) {
    switch (typeof (lat)) {
      case 'string':
        lat = ConvertLatDMSToDD(lat)
        lon = ConvertLonDMSToDD(lon)
        // Don't break
      case 'number':
        latitudeScope(lat)
        longitudeScope(lon)
        return [lat, lon]
      default:
        throw { type: 'parseError', value: 'Wrong value' }
    }
  }
}


function latitudeScope(latitude) {
  if (latitude >= -90.0 && latitude <= 90.0) {
    return true
  }
  throw { type: 'parseError', value: 'Latitude out of scope' }
}

function longitudeScope(longitude) {
  if (longitude >= -180.0 && longitude <= 180.0) {
    return true
  }
  throw { type: 'parseError', value: 'Longitude out of scope' }
}

function ConvertLatDMSToDD(lat) {
  return ConvertDMSToDD(lat, 'lat')
}

function ConvertLonDMSToDD(lon) {
  return ConvertDMSToDD(lon, 'lon')
}

function ConvertDMSToDD(coordinate, type) {
  var parts = coordinate.split(/[^\d\w.]+/)
  try {
    var dd = Number(parts[0]) + Number(parts[1]) / 60 + Number(parts[2]) / (60 * 60)
    if ((type === 'lat' && parts[3] === 'S') ||
       (type === 'lon' && parts[3] === 'W')) {
      dd = dd * -1
    } else if ((type === 'lat' && parts[3] !== 'N') ||
       (type === 'lon' && parts[3] !== 'E')) {
      throw -1
    }
  } catch (err) {
    throw { type: 'parseError', value: 'Wrong coordinate format' }
  }
  return dd
}
