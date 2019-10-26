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
  const [clickedPosition, setClickedPosition] = React.useState({})
  const [selectedLocation, setSelectedLocation] = React.useState()
  const [searchPhrase, setSearchPhrase] = React.useState()

  const { isLoggedIn, getTokenSilently, login, user } = useAuth0()

  if (!isLoggedIn) {
    getTokenSilently().then((token) => {
      login(user.name, token)
    })
  }

  return (
    <div className='App'>

      <NavBarContainer onSearch={phrase => setSearchPhrase(phrase)} />

      <div style={{ boxSizing: 'border-box', paddingTop: 55, height: '100vh', position: 'relative' }}>
        <MapContainer
          openContextMenu={(x, y, px, py) => {
            setClickedPosition({ x, y })
            setShowContextMenu(true)
            // setSelectedLocation({ px, py })
          }}
          closeContextMenu={() => setShowContextMenu(false)}
          openLocationTab={point => {
            setLocationTabContent(true)
            setSelectedLocation(point)
          }}
          onUpdateMarkerPosition={coordinates => setSelectedLocation(coordinates)}
        />

        <LocationTabContainer
          content={locationTabContent}
          selectedLocation={selectedLocation}
          closeLocationTab={() => setLocationTabContent(false)}
          addMarkerX={clickedPosition.x}
          addMarkerY={clickedPosition.y}
          refreshMap={async () => {
            refs.map.clearAddMarker()
            refs.map.loadMapMarkers()
          }}
          focusPoint={point => refs.map.setMapCenter(point.location.lat, point.location.lon)}
          searchPhrase={searchPhrase}
        />
      </div>

      {showContextMenu &&
        <ContextMenu
          addMarker={async (x, y) => {
            setLocationTabContent('addMarker')
            setShowContextMenu(false)
            // refs.map.addMarker(selectedLocation.x, selectedLocation.y) TODO: Convert ref
          }}

          coordinates={clickedPosition}
        />
      }

    </div>
  )
}

export default App
