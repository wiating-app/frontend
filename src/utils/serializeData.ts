import { Location } from '../typings'

interface RawLocationData {
  location: {
    lat: number
    lon: number
  }
  created_timestamp: number
  last_modified_timestamp: number
  [key: string]: any
}

export default (data: any): Location => {
  const rawData = data as RawLocationData
  return {
    ...rawData,
    location: {
      lat: rawData.location?.lat || 0,
      lng: rawData.location?.lon || 0,
    },
    // Convert dates to the same format like in logs.
    created_timestamp: rawData.created_timestamp
      ? new Date(rawData.created_timestamp * 1000)
      : new Date(),
    last_modified_timestamp: rawData.last_modified_timestamp
      ? new Date(rawData.last_modified_timestamp * 1000)
      : new Date(),
  } as Location
}

