import 'leaflet/dist/leaflet.css'

import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet'
import { GpsFixed, GpsNotFixed } from '@material-ui/icons'
import { Typography, useMediaQuery } from '@material-ui/core'
import {
  activeLocationState,
  editModeState,
  isDrawerOpenState,
  searchResultsState,
} from '../state'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import ContextMenu from './ContextMenu'
import Control from 'react-leaflet-custom-control'
import Export from './Export'
import { Icon, LatLngBounds } from 'leaflet'
import Legend from './Legend'
import PixiOverlay from 'react-leaflet-pixi-overlay'
import React from 'react'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import history from '../history'
import { useRecoilState } from 'recoil'
import { Location } from '../typings'

interface MapProps {
  center?: [number, number]
  zoom?: number
  bounds?: any
  isLoggedIn: boolean
  userLocation?: [number, number]
  markers: Location[]
  locationAccuracy?: number
  getMarkers: (bounds: any) => void
  setStoredPosition: (coords: any) => void
  activeTypes: any[]
}

const Map = ({
  center = [50.39805, 16.844417], // The area of Polish mountains.
  zoom = 7,
  bounds,
  isLoggedIn,
  userLocation,
  markers,
  locationAccuracy,
  getMarkers,
  setStoredPosition,
  activeTypes,
}: MapProps) => {
  const [contextMenu, setContextMenu] = React.useState<boolean>(false)
  const [previousBounds, setPreviousBounds] = React.useState<LatLngBounds | undefined>()

  const mapRef = React.useRef<any>()
  const initiated = !!mapRef?.current
  const positionInitializedRef = React.useRef(false)
  const [editMode] = useRecoilState(editModeState)
  const [, setSearchResults] = useRecoilState(searchResultsState)
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isPhone = useMediaQuery(theme.breakpoints.down('xs'))
  const classes = useStyles(editMode)

  const currentZoom = mapRef?.current?._zoom || zoom
  const markerSize = currentZoom < 7
    ? 6
    : currentZoom < 10
      ? currentZoom - 1
      : currentZoom < 11
        ? 20
        : 32

  React.useEffect(() => {
    if (activeLocation?.location && !contextMenu && initiated && !isMobile) {
      const newZoom = currentZoom < 10 ? 11 : undefined
      mapRef.current.flyTo(activeLocation.location, newZoom)
    }
  }, [activeLocation])

  // Only apply center/bounds on initial mount, not on every prop change
  // This prevents the map from jumping back to stored position when user pans
  React.useEffect(() => {
    if (!positionInitializedRef.current && initiated) {
      if (bounds && !activeLocation) {
        // Bounds take precedence over center
        mapRef.current.flyToBounds(bounds)
        positionInitializedRef.current = true
      } else if (center && !activeLocation) {
        mapRef.current.flyTo(center)
        positionInitializedRef.current = true
      }
    }
  }, [center, bounds, initiated, activeLocation])

  React.useEffect(() => {
    if (isMobile) {
      mapRef.current.invalidateSize()
      if (activeLocation?.location && initiated) {
        const newZoom = currentZoom < 11 ? 12 : undefined
        mapRef.current.flyTo(activeLocation.location, newZoom)
      }
    }
  }, [activeLocation, isDrawerOpen, isMobile])

  const handleLoadMapMarkers = async (newZoom: number, newBounds: any) => {
    // Check whether viewport really changed to prevent multiple requests for
    // the same data.
    if (JSON.stringify(newBounds) !== JSON.stringify(previousBounds)) {
      // Prevend getMarkers on zoom in, because the current ones can be used.
      // Load them anyway if this is the first call - previousBounds is not
      // defined, or when entering the details view on mobile - isMobile && isDrawerOpen.
      if (newZoom <= currentZoom || !previousBounds || (isMobile && isDrawerOpen)) {
        getMarkers(newBounds)
      }
      setStoredPosition({ bounds: newBounds, zoom: newZoom })
      setPreviousBounds(newBounds)
    }
  }

  React.useEffect(() => {
    // Refresh markers when active types change.
    const handleAsync = async () => {
      if (initiated) {
        const bounds = await mapRef.current.getBounds()
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
          ? { height: (theme as any).layout.mobileMiniMapHeight }
          : { marginLeft: (theme as any).layout.locationTabWidth }
        : {}
      }
    >
      <MapContainer
        whenCreated={(mapInstance: any) => { mapRef.current = mapInstance }}
        className={classes.mapOffset}
        center={center}
        zoom={zoom}
        minZoom={5}
        maxZoom={18}
        maxBounds={[[-90, -180], [90, 180]]}
        zoomControl={false}
        id='cy-map'
      >
        <MapEvents
          editMode={editMode}
          isLoggedIn={isLoggedIn}
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
          handleLoadMapMarkers={handleLoadMapMarkers}
        />
        <TileLayer
          url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
        />
        <PixiOverlay
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
                setContextMenu(false)
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
            eventHandlers={{
              moveend: (e: any) => {
                if (editMode) {
                  setActiveLocation({
                    ...activeLocation,
                    location: e.target.getLatLng(),
                  } as Location)
                }
              },
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
              setContextMenu(false)
              history.push('/location/new')
              mapRef.current.setView(activeLocation.location)
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
        {(!isDrawerOpen || !isPhone) && <ZoomControl position='topright' />}
        {/*
          NOTE: We use container={{ style: { display: ... } }} instead of conditional rendering
          for Control components from react-leaflet-custom-control.

          The react-leaflet-custom-control library moves DOM nodes to Leaflet's control containers
          using append/prepend, but doesn't properly clean up when components unmount. When React
          tries to unmount a conditionally rendered Control component, it attempts to remove the
          node from its expected parent, but the node has already been moved to Leaflet's container,
          causing "Failed to execute 'removeChild'" errors.

          Solution: Keep Control components always mounted but hide them with CSS display: none.
          This avoids the unmount/remount cycle that causes DOM conflicts.

          Note: Standard react-leaflet components like ZoomControl can be conditionally rendered
          safely as they properly handle React lifecycle and Leaflet's control API.
        */}
        <Control position='topright' container={{ style: { display: (!isDrawerOpen || !isPhone) ? 'block' : 'none' } }}>
              <a
                className={classes.customControl}
                onClick={() => userLocation &&
                  mapRef.current.flyTo(userLocation, 14)
                }
                style={{ pointerEvents: userLocation ? 'auto' : 'none', opacity: userLocation ? 1 : 0.33 }}
              >
                {userLocation
                  ? <GpsFixed className={classes.customControlIcon} />
                  : <GpsNotFixed className={classes.customControlIcon} />
                }
              </a>
            </Control>
        <Control position='topright' container={{ style: { display: ((!isDrawerOpen || !isPhone) && !editMode) ? 'block' : 'none' } }}>
                <Export markers={markers} className={classes.customControl} />
              </Control>
        <Control position='bottomright'>
          {userLocation && (!isDrawerOpen || !isPhone) &&
            <Typography
              component='div'
              variant='caption'
              className={classes.userLocation}
            >Dokładność GPS: {Math.round(locationAccuracy || 0)} m</Typography>
          }
        </Control>
        <ScaleControl position='bottomright' imperial={false} />
        <Control position='topleft' container={{ style: { display: (!isMobile && !editMode) ? 'block' : 'none' } }}>
            <Legend boxed />
          </Control>
      </MapContainer>
    </div>
  )
}


interface MapEventsProps {
  editMode: boolean
  isLoggedIn: boolean
  contextMenu: boolean
  setContextMenu: (value: boolean) => void
  activeLocation: Location | null
  setActiveLocation: (location: Location | null) => void
  handleLoadMapMarkers: (zoom: number, bounds: any) => void
}

const MapEvents = ({
  editMode,
  isLoggedIn,
  contextMenu,
  setContextMenu,
  activeLocation,
  setActiveLocation,
  handleLoadMapMarkers,
}: MapEventsProps) => {
  useMapEvents({
    moveend: async (e: any) => {
      const bounds = await e.target.getBounds()
      handleLoadMapMarkers(e.sourceTarget._zoom, bounds)
    },
    contextmenu: (e: any) => {
      if (!editMode) {
        if (isLoggedIn) {
          setContextMenu(!contextMenu)
          setActiveLocation(contextMenu ? null : { location: e.latlng } as Location)
        }
        history.push('/')
      }
    },
    click: (e: any) => {
      if (contextMenu) {
        // If context menu is opened, close it.
        setContextMenu(false)
        setActiveLocation(null)
      } else if (editMode && isLoggedIn && !activeLocation) {
        // Handle mode of setting location by pinning on map.
        setActiveLocation({ location: e.latlng } as Location)
        history.push('/location/new')
      }
    },
  })
  return null
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
    '& .leaflet-pixi-overlay': {
      // Move PIXI markers on top of a current location marker.
      zIndex: 1000,
      // Hide PIXI overlay while being in edit mode.
      display: (editMode: boolean) => editMode ? 'none' : 'block',
    },
  },
  popup: {
    '& .leaflet-popup-content-wrapper': {
      backgroundColor: 'transparent',
      border: 'none',
      '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: 20,
        height: 1,
        left: 'calc(50% - 10px)',
        bottom: 0,
        backgroundColor: 'white',
      },
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
