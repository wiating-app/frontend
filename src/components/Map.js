import React from 'react'
import {
  Map as MapComponent,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ContextMenu from './ContextMenu'
import { makeStyles } from '@material-ui/core/styles'


const Map = React.forwardRef((props, ref) => {
  const [mapInstance, setMapInstance] = React.useState()
  const [layer, setLayer] = React.useState()
  const [newMarkerLayer, setNewMarkerLayer] = React.useState()
  const [currentPointId, setCurrentPointId] = React.useState()
  const [contextMenuPosition, setContextMenuPosition] = React.useState()

  const mapRef = React.useRef()

  const classes = useStyles()

  React.useEffect(() => {
    loadMapMarkers()
  }, [])


  React.useEffect(() => {
    if (mapInstance && newMarkerLayer) {
      // Open context menu
      map.getSignals().addListener(window, 'map-contextmenu', function click(e) {
        if (props.isLoggedIn) {
          const coords = window.SMap.Coords.fromEvent(e.data.event, map)
          props.openContextMenu(e.data.event.clientX, e.data.event.clientY, coords)
          props.unsetCurrentLocation()
          setNewMarker(coords.x, coords.y)
        }
      })

      // Close context menu on map click
      map.getSignals().addListener(window, 'map-click', function() {
        props.closeContextMenu()
      })

      map.getSignals().addListener(window, 'marker-drag-move', function(e) {
        const coords = window.SMap.Coords.fromEvent(e.data.event, map)
        props.onUpdateMarkerPosition(coords.x, coords.y)
      })

      setMapInstance(map)
      setLayer(layer)
      loadMapMarkers()
    }
  }, [mapInstance, newMarkerLayer])


  // Handle refs.
  React.useImperativeHandle(ref, () => ({
    clearAddMarker() {
      newMarkerLayer.removeAll()
    },
    setNewMarker(lon, lat) {
      setNewMarker(lon, lat)
    },
    loadMapMarkers() {
      loadMapMarkers()
    },
    setMapCenter(lon, lat) {
      mapRef.current.leafletElement.setView([lat, lon], 8)
    },
  }))


  const loadMapMarkers = () => {
    const bounds = mapRef.current.leafletElement.getBounds()
    props.setStoredPosition(mapRef.current.viewport)
    props.loadMapMarkers(bounds)
  }


  const setNewMarker = (lon, lat) => {
    // Clear existing markers
    newMarkerLayer.removeAll()

    // Create custom pin icon
    const pointer = window.JAK.mel('div')
    const image = window.JAK.mel('img', { src: '/pin2.svg' })
    pointer.appendChild(image)

    const position = window.SMap.Coords.fromWGS84(lon, lat)

    // Create marker
    const marker = new window.SMap.Marker(position, 'newPointMarker', { url: pointer })
    marker.decorate(window.SMap.Marker.Feature.Draggable)

    // Add marker to layer
    newMarkerLayer.addMarker(marker)
  }


  return (
    <MapComponent
      ref={mapRef}
      className={classes.root}
      center={props.center}
      zoom={props.zoom}
      maxZoom={18}
      onMoveEnd={() => loadMapMarkers()}
      onClick={e => setContextMenuPosition(e.latlng)}
    >
      <TileLayer
        url='https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}'
        attribution={`&copy; <a href="https://www.seznam.cz" target="_blank" rel="noopener">Seznam.cz, a.s.</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>, &copy; NASA`}
      />
      {props.points && props.points.map(item => {
        const { lat, lon } = item._source.location
        return <Marker
          key={item._id}
          icon={new Icon({
            iconUrl: '/pin2.svg',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })}
          position={[lat, lon]}
          onClick={() => {
            const { _id: id, _source } = item
            const point = { id, ..._source }
            props.openLocationTab(point)
            mapRef.current.leafletElement.setView([lat, lon])
          }}
        />
      })}
      {contextMenuPosition &&
        <Popup
          position={contextMenuPosition}
          closeButton={false}
          keepInView
          className={classes.popup}
        >
          <ContextMenu addMarker={() => props.addMarker()} />
        </Popup>
      }
    </MapComponent>
  )
})

Map.defaultProps = {
  center: [50.39805, 16.844417],
  zoom: 7,
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  popup: {
    '& .leaflet-popup-content-wrapper': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '& .leaflet-popup-content': {
      margin: 0,
      borderRadius: 0,
      border: 'none',
    },
  },
}))

export default Map
