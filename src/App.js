import React from 'react'
import { withRouter } from 'react-router-dom'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import Layout from './components/Layout'
import MapContainer from './containers/MapContainer'
import LocationTabContainer from './containers/LocationTabContainer'
import NavBarContainer from './containers/NavBarContainer'


const App = ({ history }) => {
  const [locationTabContent, setLocationTabContent] = React.useState()
  const [selectedLocation, setSelectedLocation] = React.useState()
  const [searchResults, setSearchResults] = React.useState()

  const mapRef = React.useRef()

  return (
    <Layout appBar={
      <NavBarContainer
        setSearchResults={results => setSearchResults(results)}
      />
    }>

      <LocationTabContainer
        setLocationTabContent={content => setLocationTabContent(content)}
        selectedLocation={selectedLocation}
        closeLocationTab={() => {
          // setLocationTabContent(false)
          mapRef.current.setActiveMarker(null)
          history.push('/')
        }}
        searchResults={searchResults}
        refreshMap={async () => {
          await mapRef.current.loadMapMarkers()
        }}
        setActiveMarker={coords => mapRef.current.setActiveMarker(coords)}
        setSelectedLocation={location => {
          history.push(`/location/${location.id}`)
          setSelectedLocation(location)
        }}
      />

      <MapContainer
        openLocationTab={point => {
          setSearchResults(null)
          setLocationTabContent('markerInfo')
          setSelectedLocation(point)
          history.push(`/location/${point.id}`)
        }}
        closeTab={() => setLocationTabContent(null)}
        openAddMarkerTab={({ lat, lng: lon }) => {
          setSelectedLocation({ location: { lat, lon } })
          setLocationTabContent('addMarker')
          history.push('/location/new')
        }}
        onUpdateMarkerPosition={(lon, lat) => {
          setSelectedLocation({ ...selectedLocation, location: { lon, lat } })
        }}
        ref={mapRef}
      />

    </Layout>
  )
}

export default withRouter(App)
