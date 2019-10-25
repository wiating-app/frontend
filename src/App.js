import React from 'react'
import './App.css'
import { useAuth0 } from './react-auth0-wrapper'

import MapContainer from './containers/MapContainer'
import ContextMenu from './components/ContextMenu'
import LocationTabContainer from './containers/LocationTabContainer'
import NavBarContainer from './containers/NavBarContainer'


const App = () => {
  const [showContextMenu, setShowContextMenu] = React.useState()
  const [showLocationTab, setShowLocationTab] = React.useState()
  const [clickedPosition, setClickedPosition] = React.useState({})
  const [selectedLocation, setSelectedLocation] = React.useState({})
  const [searchPhrase, setSearchPhrase] = React.useState()

  const openContextMenu = (x, y, px, py) => {
    setClickedPosition({ x, y })
    setShowContextMenu(true)
    setSelectedLocation({ px, py })
  }

  const openLocationTab = point => {
    setShowLocationTab(true)
    setSelectedLocation(point)

    refs.tab.openLocationTab(point)
  }

  const addMarker = async (x, y) => {
    refs.map.addMarker(selectedLocation.x, selectedLocation.y)
    refs.tab.showMarkerForm()

    setShowContextMenu(false)
  }

  const refreshMap = async () => {
    refs.map.clearAddMarker()
    refs.map.loadMapMarkers()
  }

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
          onContextMenuClose={() => setShowContextMenu(false)}
          onContextMenu={params => openContextMenu(params)}
          openLocationTab={point => openLocationTab(point)}
          onUpdateMarkerPosition={coordinates => setSelectedLocation(coordinates)}
        />

        <LocationTabContainer
          open={showLocationTab}
          location={selectedLocation}
          addMarkerX={clickedPosition.x}
          addMarkerY={clickedPosition.y}
          refreshMap={() => refreshMap()}
          focusPoint={point => refs.map.setMapCenter(point.location.lat, point.location.lon)}
          searchPhrase={searchPhrase}
        />
      </div>

      {showContextMenu &&
        <ContextMenu
          addMarker={coordinates => addMarker(coordinates)}
          coordinates={clickedPosition}
        />
      }

    </div>
  )
}

export default App
