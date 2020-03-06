import React from 'react'
import {
  Map as MapComponent,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  ScaleControl,
} from 'react-leaflet'
import Control from 'react-leaflet-control'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'
import { GpsFixed, GpsNotFixed } from '@material-ui/icons'
import { Icon, DivIcon } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'
import ContextMenu from './ContextMenu'
import { getIconUrl } from '../utils/helpers'
import exportToKML from '../utils/exportToKML'


const Map = React.forwardRef(({
  updateCoordinates,
  ...props
}, ref) => {
  const [activeMarker, setActiveMarker] = React.useState()
  const [contextMenu, setContextMenu] = React.useState()
  const [previousBounds, setPreviousBounds] = React.useState()
  const mapRef = React.useRef()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isPhone = useMediaQuery(theme.breakpoints.down('xs'))
  const classes = useStyles()

  React.useEffect(() => {
    if (activeMarker && !contextMenu) {
      mapRef.current.leafletElement.panTo(activeMarker)
    }
  }, [activeMarker])

  React.useEffect(() => {
    if (props.center && !activeMarker) {
      mapRef.current.leafletElement.flyTo(props.center)
    }
  }, [props.center])

  React.useEffect(() => {
    if (isMobile) {
      mapRef.current.leafletElement.invalidateSize()
    }
  }, [props.isLocationTabOpen, isMobile])

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
    // Check whether viewport really changed to prevent a multiple calls for the
    // same data.
    if (JSON.stringify(bounds) !== JSON.stringify(previousBounds)) {
      props.loadMapMarkers(bounds)
      props.setStoredPosition(mapRef.current.viewport)
      setPreviousBounds(bounds)
    }
  }

  return (
    <MapComponent
      ref={mapRef}
      className={classes.root}
      style={props.isLocationTabOpen && isMobile
        ? isPhone
          ? { height: theme.layout.mobileMiniMapHeight }
          : { marginLeft: theme.layout.locationTabWidth }
        : {}
      }
      center={props.center}
      zoom={props.zoom}
      minZoom={5}
      maxZoom={18}
      maxBounds={[[-90, -180], [90, 180]]}
      zoomControl={false}
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
      <MarkerClusterGroup
        showCoverageOnHover={false}
        maxClusterRadius={60}
        disableClusteringAtZoom={11}
        spiderfyOnMaxZoom={false}
        iconCreateFunction={cluster => {
          const count = cluster.getChildCount()
          return new DivIcon({
            html: count,
            className: 'woodboard-cluster',
            iconSize: [40, 40],
          })
        }}
      >
        {props.points && props.points.map(item => {
          const { location: { lat, lon }, type } = item

          return <Marker
            key={item.id}
            icon={new Icon({
              iconUrl: getIconUrl(type),
              iconSize: [30, 30],
              iconAnchor: [15, 30],
            })}
            position={[lat, lon]}
            onClick={() => {
              props.openLocationTab(item)
              setContextMenu(null)
              setActiveMarker([lat, lon])
            }}
          />
        })}
      </MarkerClusterGroup>
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
      {props.currentLocation &&
        <Marker
          icon={new Icon({
            iconUrl: '/location-icons/current.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
          zIndexOffset={1100}
          position={props.currentLocation}
        />
      }
      {(!props.isLocationTabOpen || !isPhone) &&
        <>
          <ZoomControl position='topright' />
          <Control position='topright' className='leaflet-bar'>
            <a
              className={classes.customControl}
              onClick={() => props.currentLocation &&
                mapRef.current.leafletElement.flyTo(props.currentLocation)
              }
              disabled={!props.currentLocation}
            >
              {props.currentLocation
                ? <GpsFixed className={classes.customControlIcon} />
                : <GpsNotFixed className={classes.customControlIcon} />
              }
            </a>
          </Control>
          <Control position='topright' className='leaflet-bar'>
            <a
              className={classes.customControl}
              onClick={() => exportToKML(props.points)}
              disabled={!props.points || !props.points.length}
            >KML</a>
          </Control>
        </>
      }
      <ScaleControl position='bottomright' imperial={false} />
    </MapComponent>
  )
})

Map.defaultProps = {
  zoom: 7,
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    '& .leaflet-marker-icon': {
      filter: 'drop-shadow(0 0 1px rgb(0,0,0))',
    },
    '& .woodboard-cluster': {
      backgroundColor: 'transparent',
      backgroundImage: 'url(/woodboard.svg)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#522d19',
      filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))',
    },
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
  customControl: {
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&[disabled]': {
      pointerEvents: 'none',
      opacity: 0.67,
    },
  },
  customControlIcon: {
    fontSize: 18,
  },
}))

export default Map
