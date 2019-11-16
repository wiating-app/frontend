import React from 'react'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import Layout from './components/Layout'
import MapContainer from './containers/MapContainer'
import LocationTabContainer from './containers/LocationTabContainer'
import NavBarContainer from './containers/NavBarContainer'


const App = () => {
  const [locationTabContent, setLocationTabContent] = React.useState()
  const [selectedLocation, setSelectedLocation] = React.useState()
  const [searchResults, setSearchResults] = React.useState()

  const mapRef = React.useRef()

  return (
    <Layout appBar={
      <NavBarContainer
        setSearchResults={results => setSearchResults(results)}
        setLocationTabContent={content => setLocationTabContent(content)}
      />
    }>

      <LocationTabContainer
        content={locationTabContent}
        setLocationTabContent={content => setLocationTabContent(content)}
        selectedLocation={selectedLocation}
        closeLocationTab={() => {
          setLocationTabContent(false)
          mapRef.current.clearAddMarker()
        }}
        searchResults={searchResults}
        refreshMap={async () => {
          console.log('before clearAddMarker')
          await mapRef.current.clearAddMarker()
          console.log('before loadMapMarkers')
          await mapRef.current.loadMapMarkers()
        }}
        setMapCenter={(lon, lat) => mapRef.current.setMapCenter(lon, lat)}
        setNewMarker={(lon, lat) => mapRef.current.setNewMarker(lon, lat)}
        setSelectedLocation={location => setSelectedLocation(location)}
      />

      <MapContainer
        openContextMenu={(x, y, coords) => {
          setSelectedLocation({ location: { lon: coords.x, lat: coords.y } })
          setSearchResults(null)
        }}
        openLocationTab={point => {
          setSearchResults(null)
          setLocationTabContent('markerInfo')
          setSelectedLocation(point)
        }}
        unsetCurrentLocation={() => setLocationTabContent(null)}
        addMarker={async () => {
          setLocationTabContent('addMarker')
          const { lon, lat } = selectedLocation.location
          mapRef.current.setMapCenter(lon, lat)
        }}
        onUpdateMarkerPosition={(lon, lat) => {
          setSelectedLocation({ ...selectedLocation, location: { lon, lat } })
        }}
        condensed={!!locationTabContent}
        ref={mapRef}
      />

    </Layout>
  )
}

export default App
