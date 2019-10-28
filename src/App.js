import React from 'react'
import './App.css'
import Layout from './components/Layout'
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

  return (
    <Layout appBar={
      <NavBarContainer setSearchResults={results => {
        setSearchResults(results)
        setLocationTabContent('searchResults')
      }} />
    }>

      <LocationTabContainer
        content={locationTabContent}
        selectedLocation={selectedLocation}
        closeLocationTab={() => {
          setLocationTabContent(false)
          mapRef.current.clearAddMarker()
        }}
        searchResults={searchResults}
        refreshMap={async () => {
          mapRef.current.clearAddMarker()
          mapRef.current.loadMapMarkers()
        }}
        setMapCenter={(posY, posX) => mapRef.current.setMapCenter(posY, posX)}
      />

      <MapContainer
        openContextMenu={(x, y, coords) => {
          setContextMenuPosition({ x, y })
          setShowContextMenu(true)
          setSelectedLocation({ lat: coords.x, lon: coords.y })
        }}
        closeContextMenu={() => setShowContextMenu(false)}
        openLocationTab={point => {
          setLocationTabContent('markerInfo')
          setSelectedLocation(point)
        }}
        onUpdateMarkerPosition={coordinates => setSelectedLocation(coordinates)}
        ref={mapRef}
        style={{ flexGrow: 1 }}
      />

      {showContextMenu &&
        <ContextMenu
          addMarker={async () => {
            setLocationTabContent('addMarker')
            setShowContextMenu(false)
            mapRef.current.setMapCenter(selectedLocation.lon, selectedLocation.lat)
          }}
          position={contextMenuPosition}
          selectedLocation={selectedLocation}
        />
      }

    </Layout>
  )
}

export default App
