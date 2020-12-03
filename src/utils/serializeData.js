export default data => ({
  ...data,
  location: {
    lat: data.location.lat,
    lng: data.location.lon,
  },
})
