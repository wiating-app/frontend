import React from 'react'
import {
  Map as MapComponent,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  ScaleControl,
} from 'react-leaflet'
import { makeStyles } from '@material-ui/core/styles'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ContextMenu from './ContextMenu'
import { getIconUrl } from '../utils/helpers'


const Map = React.forwardRef(({
  updateCoordinates,
  ...props
}, ref) => {
  const [activeMarker, setActiveMarker] = React.useState()
  const [contextMenu, setContextMenu] = React.useState()
  const mapRef = React.useRef()
  const classes = useStyles()

  React.useEffect(() => {
    if (activeMarker && !contextMenu) {
      mapRef.current.leafletElement.panTo(activeMarker)
    }
  }, [activeMarker])

  // Handle refs.
  React.useImperativeHandle(ref, () => ({
    setActiveMarker(coords) {
      setActiveMarker(coords)
    },
    loadMapMarkers() {
      loadMapMarkers()
    },
  }))

  const loadMapMarkers = async () => {
    const bounds = await mapRef.current.leafletElement.getBounds()
    props.loadMapMarkers(bounds)
    props.setStoredPosition(mapRef.current.viewport)
  }


  return (
    <MapComponent
      ref={mapRef}
      className={classes.root}
      center={props.center}
      zoom={props.zoom}
      minZoom={5}
      maxZoom={18}
      maxBounds={[[-90, -180], [90, 180]]}
      zoomControl={false}
      whenReady={() => loadMapMarkers()}
      onMoveEnd={() => loadMapMarkers()}
      onContextMenu={e => {
        if (!props.editMode) {
          if (props.isLoggedIn) {
            setContextMenu(!contextMenu)
            setActiveMarker(contextMenu ? null : e.latlng)
          }
          props.closeTab()
        }
      }}
      onClick={e => {
        if (contextMenu) {
          setContextMenu(false)
          setActiveMarker(false)
        } else if (!activeMarker && props.editMode && props.isLoggedIn) {
          setActiveMarker(e.latlng)
          updateCoordinates(e.latlng)
        }
      }}
    >
      <TileLayer
        url='https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}'
        attribution={`&copy; <a href="https://www.seznam.cz" target="_blank" rel="noopener">Seznam.cz, a.s.</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>, &copy; NASA`}
      />
      {props.points && props.points.map(item => {
        const { location: { lat, lon }, type } = item._source

        return <Marker
          key={item._id}
          icon={new Icon({
            iconUrl: getIconUrl(type),
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })}
          position={[lat, lon]}
          onClick={() => {
            const { _id: id, _source } = item
            const point = { id, ..._source }
            props.openLocationTab(point)
            setContextMenu(null)
            setActiveMarker([lat, lon])
          }}
        />
      })}
      {activeMarker &&
        <Marker
          icon={new Icon({
            iconUrl: '/location-icons/point.svg',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          })}
          zIndexOffset={1000}
          position={activeMarker}
          draggable={props.editMode}
          onMoveEnd={e => {
            if (props.editMode) {
              updateCoordinates(e.target.getLatLng())
            }
          }}
        />
      }
      {activeMarker && contextMenu &&
        <Popup
          position={activeMarker}
          closeButton={false}
          className={classes.popup}
        >
          <ContextMenu addMarker={() => {
            setContextMenu(null)
            props.openAddMarkerTab(activeMarker)
            mapRef.current.leafletElement.setView(activeMarker)
          }} />
        </Popup>
      }
      <ZoomControl position='topright' />
      <ScaleControl position='bottomright' imperial={false} />
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
