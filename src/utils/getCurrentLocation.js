export default function getCurrentLocation(callback) {
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    // Check if geolocation is supported/enabled on current browser.
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        // For when getting location is a success.
        callback([position.coords.latitude, position.coords.longitude])
      },
      function error(errorMessage) {
        console.error('An error has occured while retrieving location.', errorMessage)
        callback(null)
      }
    )
  } else {
    console.log('Geolocation is not enabled on this browser.')
    callback(null)
  }
}
