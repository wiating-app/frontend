import React from 'react'
import './App.css'
import { useAuth0 } from './react-auth0-wrapper'

import MapContainer from './containers/MapContainer'
import ContextMenu from './components/ContextMenu'
import LocationTabContainer from './containers/LocationTabContainer'
import NavBarContainer from './containers/NavBarContainer'


const App = () => {
  const [showContextMenu, setShowContextMenu] = React.useState()
  const [locationTabContent, setLocationTabContent] = React.useState()
  const [contextMenuPosition, setContextMenuPosition] = React.useState({})
  const [selectedLocation, setSelectedLocation] = React.useState()
  const [searchResults, setSearchResults] = React.useState()

  const mapRef = React.useRef()

  const { isLoggedIn, getTokenSilently, login, user } = useAuth0()

  if (!isLoggedIn) {
    getTokenSilently().then((token) => {
      login(user.name, token)
    })
  }

  return (
    <div className='App'>

      <NavBarContainer setSearchResults={results => {
        setSearchResults(results)
        setLocationTabContent('searchResults')
      }} />

      <div style={{ boxSizing: 'border-box', paddingTop: 55, height: '100vh', position: 'relative' }}>
        <MapContainer
          openContextMenu={(x, y, lat, lon) => {
            setContextMenuPosition({ x, y })
            setShowContextMenu(true)
            setSelectedLocation({ lat, lon })
          }}
          closeContextMenu={() => setShowContextMenu(false)}
          openLocationTab={point => {
            setLocationTabContent('markerInfo')
            setSelectedLocation(point)
          }}
          onUpdateMarkerPosition={coordinates => setSelectedLocation(coordinates)}
          ref={mapRef}
        />

        <LocationTabContainer
          content={locationTabContent}
          selectedLocation={selectedLocation}
          closeLocationTab={() => setLocationTabContent(false)}
          searchResults={searchResults}
          refreshMap={async () => {
            mapRef.current.clearAddMarker()
            mapRef.current.loadMapMarkers()
          }}
          focusPoint={point => mapRef.current.setMapCenter(point.location.lat, point.location.lon)}
        />
      </div>

      {showContextMenu &&
        <ContextMenu
          addMarker={async (x, y) => {
            setLocationTabContent('addMarker')
            setShowContextMenu(false)
          }}
          coordinates={contextMenuPosition}
        />
      }

    </div>
  )
}

export default App
