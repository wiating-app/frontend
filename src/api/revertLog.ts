import api from '../api'
import { LogDetails } from '../typings'
import { getPoint } from './getPoint'

export const revertLog = async (logDetails: LogDetails): Promise<void> => {
  const { _source } = logDetails
  // Use another endpoint if change from given log refers to image.
  // eslint-disable-next-line camelcase
  if (_source.changes?.images?.new_value) {
    await api.delete(`delete_image/${_source.doc_id}/${_source.changes.images.new_value}`)
  } else {
    // Fetch current location data to ensure all required fields are present
    const currentLocation = await getPoint(_source.doc_id)

    // Build base data object with all required fields from current location
    const baseData: any = {
      name: currentLocation.name,
      description: currentLocation.description || '',
      directions: currentLocation.directions || '',
      type: currentLocation.type,
      location: {
        lat: currentLocation.location.lat,
        lon: currentLocation.location.lng, // Convert lng to lon for API
      },
      is_disabled: currentLocation.is_disabled || false,
      water_exists: currentLocation.water_exists ?? null,
      water_comment: currentLocation.water_comment || null,
      fire_exists: currentLocation.fire_exists ?? null,
      fire_comment: currentLocation.fire_comment || null,
      unpublished: currentLocation.unpublished || false,
    }

    // Apply reverted values from changes on top of base data
    const dataObject = Object.entries(_source.changes || {}).reduce((acc, [name, value]: [string, any]) => {
      if (name === 'location' && value.old_value) {
        // Handle location field specially - convert lng to lon if needed
        const oldLocation = value.old_value
        acc[name] = {
          lat: oldLocation.lat ?? currentLocation.location.lat,
          lon: oldLocation.lon ?? oldLocation.lng ?? currentLocation.location.lng,
        }
      } else {
        acc[name] = value.old_value ?? acc[name]
      }
      return acc
    }, baseData)

    await api.put(`modify_point/${_source.doc_id}`, dataObject)
  }
}
