import React from 'react'
import { withRouter } from 'react-router-dom'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.css'
import Layout from './components/Layout'
import MapContainer from './containers/MapContainer'
import LocationTab from './components/LocationTab'
import NavBarContainer from './containers/NavBarContainer'


const App = ({ history }) => {
  const [cachedLocation, setCachedLocation] = React.useState()
  const [searchResults, setSearchResults] = React.useState()

  const mapRef = React.useRef()

  return (
    <Layout appBar={
      <NavBarContainer
        setSearchResults={results => setSearchResults(results)}
      />
    }>

      <LocationTab
        cachedLocation={cachedLocation}
        setCachedLocation={setCachedLocation}
        closeLocationTab={() => {
          mapRef.current.setActiveMarker(null)
          history.push('/')
        }}
        searchResults={searchResults}
        refreshMap={async () => {
          await mapRef.current.loadMapMarkers()
        }}
        setActiveMarker={coords => mapRef.current.setActiveMarker(coords)}
      />

      <MapContainer
        openLocationTab={point => {
          setSearchResults(null)
          setCachedLocation(point)
          history.push(`/location/${point.id}`)
        }}
        closeTab={() => history.push('/')}
        openAddMarkerTab={({ lat, lng: lon }) => {
          setCachedLocation({ location: { lat, lon } })
          history.push('/location/new')
        }}
        onUpdateMarkerPosition={(lon, lat) => {
          setCachedLocation({ ...cachedLocation, location: { lon, lat } })
        }}
        ref={mapRef}
      />

    </Layout>
  )
}

export default withRouter(App)
