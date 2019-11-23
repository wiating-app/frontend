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
          mapRef.current.setActiveMarker(null)
        }}
        searchResults={searchResults}
        refreshMap={async () => {
          await mapRef.current.loadMapMarkers()
        }}
        setActiveMarker={coords => mapRef.current.setActiveMarker(coords)}
        setSelectedLocation={location => setSelectedLocation(location)}
      />

      <MapContainer
        openLocationTab={point => {
          setSearchResults(null)
          setLocationTabContent('markerInfo')
          setSelectedLocation(point)
        }}
        closeTab={() => setLocationTabContent(null)}
        openAddMarkerTab={({ lat, lng: lon }) => {
          setSelectedLocation({ location: { lat, lon } })
          setLocationTabContent('addMarker')
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
