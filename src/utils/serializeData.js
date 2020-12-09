export default data => ({
  ...data,
  location: {
    lat: data.location.lat,
    lng: data.location.lon,
  },
  // Convert dates to the same format like in logs.
  created_timestamp: new Date(data.created_timestamp * 1000),
  last_modified_timestamp: new Date(data.last_modified_timestamp * 1000),
})
