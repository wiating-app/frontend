import React from 'react'
import {
  Map as MapComponent,
  Marker,
  Popup,
  TileLayer,
  Circle,
  ZoomControl,
  ScaleControl,
} from 'react-leaflet'
import Control from 'react-leaflet-control'
import { useRecoilState } from 'recoil'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Typography, useMediaQuery, Tooltip } from '@material-ui/core'
import { GpsFixed, GpsNotFixed } from '@material-ui/icons'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'
import {
  editModeState,
  isDrawerOpenState,
  activeLocationState,
  searchResultsState,
} from '../state'
import PixiOverlay from './PixiOverlay'
import ContextMenu from './ContextMenu'
import Legend from './Legend'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import exportToKML from '../utils/exportToKML'
import history from '../history'


const Map = React.forwardRef(({
  center,
  zoom,
  isLoggedIn,
  userLocation,
  markers,
  locationAccuracy,
  getMarkers,
  setStoredPosition,
  activeTypes,
}, ref) => {
  const [contextMenu, setContextMenu] = React.useState()
  const [previousBounds, setPreviousBounds] = React.useState()
  const mapRef = React.useRef()
  const [editMode] = useRecoilState(editModeState)
  const [, setSearchResults] = useRecoilState(searchResultsState)
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isPhone = useMediaQuery(theme.breakpoints.down('xs'))
  const classes = useStyles()

  const currentZoom = mapRef?.current?.leafletElement?._zoom || zoom
  const markerSize = currentZoom < 7
    ? 6
    : currentZoom < 10
      ? currentZoom - 1
      : currentZoom < 11
        ? 20
        : 32

  React.useEffect(() => {
    if (activeLocation && !contextMenu) {
      const { lat, lng } = activeLocation.location
      mapRef.current.leafletElement.panTo([lat, lng])
    }
  }, [activeLocation])

  React.useEffect(() => {
    if (center && !activeLocation) {
      mapRef.current.leafletElement.flyTo(center)
    }
  }, [center])

  React.useEffect(() => {
    if (isMobile) {
      mapRef.current.leafletElement.invalidateSize()
      if (activeLocation?.location) {
        mapRef.current.leafletElement.flyTo(activeLocation.location)
      }
    }
  }, [isDrawerOpen, isMobile])

  // Handle refs.
  React.useImperativeHandle(ref, () => ({
    loadMapMarkers() {
      handleLoadMapMarkers()
    },
  }))

  const handleLoadMapMarkers = async () => {
    const bounds = await mapRef.current.leafletElement.getBounds()
    // Check whether viewport really changed to prevent a multiple calls for the
    // same data.
    if (JSON.stringify(bounds) !== JSON.stringify(previousBounds)) {
      getMarkers(bounds)
      setStoredPosition(mapRef.current.viewport)
      setPreviousBounds(bounds)
    }
  }

  React.useEffect(() => {
    // Refresh markers after active types changed.
    const handleAsync = async () => {
      if (mapRef.current.leafletElement._loaded) {
        const bounds = await mapRef.current.leafletElement.getBounds()
        getMarkers(bounds)
      }
    }
    handleAsync()
  }, [activeTypes])

  return (
    // Use wrapper to set offset to load markers that are on the edge of a screen.
    <div
      className={classes.offsetWrapper}
      style={isDrawerOpen && isMobile
        ? isPhone
          ? { height: theme.layout.mobileMiniMapHeight }
          : { marginLeft: theme.layout.locationTabWidth }
        : {}
      }
    >
      <MapComponent
        ref={mapRef}
        className={classes.mapOffset}
        center={center}
        zoom={zoom}
        minZoom={5}
        maxZoom={18}
        maxBounds={[[-90, -180], [90, 180]]}
        zoomControl={false}
        onMoveEnd={() => handleLoadMapMarkers()}
        onContextMenu={e => {
          if (!editMode) {
            if (isLoggedIn) {
              setContextMenu(!contextMenu)
              setActiveLocation(contextMenu ? null : { location: e.latlng })
            }
            history.push('/')
          }
        }}
        onClick={e => {
          if (contextMenu) {
            // If context menu is opened, close it.
            setContextMenu(false)
            setActiveLocation(null)
          } else if (editMode && isLoggedIn && !activeLocation) {
            // Add location by pinning on map mode.
            setActiveLocation({ location: e.latlng })
            history.push('/location/new')
          }
        }}
      >
        <TileLayer
          url='https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}'
          attribution={`&copy; <a href="https://www.seznam.cz" target="_blank" rel="noopener">Seznam.cz, a.s.</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>, &copy; NASA`}
        />
        <PixiOverlay
          map={mapRef?.current?.leafletElement}
          markers={markers.map(item => {
            const { location: { lat, lng }, id, type } = item
            return {
              id,
              customIcon: generateMarkerIcon(type, markerSize),
              iconId: `${type}_${markerSize}`,
              position: [lat, lng],
              onClick: () => {
                setSearchResults([])
                setActiveLocation(item)
                history.push(`/location/${item.id}`)
                setContextMenu(null)
              },
            }
          }) || []}
        />
        {activeLocation &&
          <Marker
            icon={new Icon({
              iconUrl: '/active-location.svg',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            })}
            zIndexOffset={1100}
            position={activeLocation.location}
            draggable={editMode}
            onMoveEnd={e => {
              if (editMode) {
                setActiveLocation({
                  ...activeLocation,
                  location: e.target.getLatLng(),
                })
              }
            }}
          />
        }
        {activeLocation && contextMenu &&
          <Popup
            position={activeLocation.location}
            closeButton={false}
            className={classes.popup}
          >
            <ContextMenu addMarker={() => {
              setContextMenu(null)
              history.push('/location/new')
              mapRef.current.leafletElement.setView(activeLocation.location)
            }} />
          </Popup>
        }
        {userLocation &&
          <>
            {locationAccuracy && locationAccuracy > 30 &&
              <Circle
                center={userLocation}
                radius={locationAccuracy}
              />
            }
            <Marker
              icon={new Icon({
                iconUrl: '/current-location.svg',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
              zIndexOffset={1000}
              position={userLocation}
            />
          </>
        }
        {(!isDrawerOpen || !isPhone) &&
          <>
            <ZoomControl position='topright' />
            <Control position='topright' className='leaflet-bar'>
              <a
                className={classes.customControl}
                onClick={() => userLocation &&
                  mapRef.current.leafletElement.flyTo(userLocation, 14)
                }
                disabled={!userLocation}
              >
                {userLocation
                  ? <GpsFixed className={classes.customControlIcon} />
                  : <GpsNotFixed className={classes.customControlIcon} />
                }
              </a>
            </Control>
            {!editMode &&
              <Control position='topright' className='leaflet-bar'>
                <Tooltip title='Eksportuj aktualny widok do KML' placement='left'>
                  <a
                    className={classes.customControl}
                    onClick={() => exportToKML(markers)}
                    disabled={!markers.length}
                  >KML</a>
                </Tooltip>
              </Control>
            }
          </>
        }
        <Control position='bottomright'>
          {userLocation && (!isDrawerOpen || !isPhone) &&
            <Typography
              component='div'
              variant='caption'
              className={classes.userLocation}
            >Dokładność GPS: {Math.round(locationAccuracy)} m</Typography>
          }
        </Control>
        <ScaleControl position='bottomright' imperial={false} />
        {!isMobile && !editMode &&
          <Control position='topleft'>
            <Legend boxed />
          </Control>
        }
      </MapComponent>
    </div>
  )
})

Map.defaultProps = {
  zoom: 7,
}

const useStyles = makeStyles(theme => ({
  offsetWrapper: {
    flexGrow: 1,
    position: 'relative',
  },
  // Map offset to load markers that are on the edge of a screen.
  mapOffset: {
    position: 'absolute',
    top: 0,
    left: theme.spacing(-2),
    bottom: theme.spacing(-4),
    right: theme.spacing(-2),
    // Offset must be compensed on controls.
    '& .leaflet-right': {
      right: theme.spacing(2),
    },
    '& .leaflet-bottom': {
      bottom: theme.spacing(4),
    },
    '& .leaflet-left': {
      left: theme.spacing(2),
    },
    // Add light shadow to all markers.
    '& .leaflet-marker-icon': {
      filter: 'drop-shadow(0 0 1px rgb(0,0,0))',
    },
    // Move PIXI markers on top of a current location marker.
    '& .leaflet-pixi-overlay': {
      zIndex: 1000,
    },
  },
  woodboardCluster: {
    backgroundColor: 'transparent',
    backgroundImage: 'url(/woodboard.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#522d19',
    filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))',
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
      opacity: 0.33,
    },
  },
  customControlIcon: {
    fontSize: 18,
  },
  userLocation: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: '0 2px',
    fontSize: 11,
  },
}))

export default Map
