export function parseCoordinates(input) {
  var [lat, lon] = input.split(/[,\s]+/)

  // TODO: Check first data type, then do conversion so user can see the "out of scope" errors.
  try {
    const parsedLat = parseFloat(lat)
    const parsedLon = parseFloat(lon)
    checkScope(parsedLat, 'lat')
    checkScope(parsedLon, 'lon')
    return [parsedLat, parsedLon]
  } catch (err) {
    try {
      const convertedCoordinates = [
        ConvertDMSToDD(lat, 'lat'),
        ConvertDMSToDD(lon, 'lon'),
      ]
      return convertedCoordinates
    } catch (err) {
      throw new Error(err)
    }
  }
}


function checkScope(coordinate, type) {
  switch (type) {
    case 'lat':
      if (coordinate >= -90.0 && coordinate <= 90.0) {
        return true
      } else {
        throw new Error('Latitude out of scope')
      }

    case 'lon':
      if (coordinate >= -180.0 && coordinate <= 180.0) {
        return true
      } else {
        throw new Error('Longitude out of scope')
      }
  }
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
    throw new Error('Wrong coordinate format')
  }
  return dd
}
