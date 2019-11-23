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
  const [activeMarker, setActiveMarker] = React.useState()
  const [contextMenu, setContextMenu] = React.useState()
  const mapRef = React.useRef()
  const classes = useStyles()

  // Handle refs.
  React.useImperativeHandle(ref, () => ({
    setActiveMarker(coords) {
      setActiveMarker(coords)
    },
    loadMapMarkers() {
      loadMapMarkers()
    },
  }))

  const loadMapMarkers = () => {
    const bounds = mapRef.current.leafletElement.getBounds()
    props.setStoredPosition(mapRef.current.viewport)
    props.loadMapMarkers(bounds)
  }

  React.useEffect(() => {
    loadMapMarkers()
  }, [])


  return (
    <MapComponent
      ref={mapRef}
      className={classes.root}
      center={props.center}
      zoom={props.zoom}
      maxZoom={18}
      onMoveEnd={() => loadMapMarkers()}
      onClick={e => {
        setActiveMarker(contextMenu ? null : e.latlng)
        setContextMenu(true)
        props.closeTab()
      }}
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
            setActiveMarker([lat, lon])
            setContextMenu(null)
          }}
        />
      })}
      {activeMarker &&
        <Marker
          icon={new Icon({
            iconUrl: '/pin2.svg',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
          })}
          position={activeMarker}
        />
      }
      {activeMarker && contextMenu &&
        <Popup
          position={activeMarker}
          closeButton={false}
          keepInView
          className={classes.popup}
        >
          <ContextMenu addMarker={() => {
            setContextMenu(null)
            props.openAddMarkerTab(activeMarker)
            mapRef.current.leafletElement.setView(activeMarker)
          }} />
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
    marginBottom: 50,
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
