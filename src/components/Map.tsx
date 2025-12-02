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
import { LocateFixed, LocateOff } from 'lucide-react'
import Typography from './Typography'
import Menu from './Menu'
import useMediaQuery from '../utils/useMediaQuery'
import useLanguage from '../utils/useLanguage'
import {
  activeLocationState,
  editModeState,
  isDrawerOpenState,
  searchResultsState,
} from '../state'

import Control from 'react-leaflet-custom-control'
import Export from './Export'
import { Icon, LatLngBounds } from 'leaflet'
import Legend from './Legend'
import PixiOverlay from 'react-leaflet-pixi-overlay'
import React from 'react'
import classNames from 'classnames'
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
  const { isPhone, isNotPhone } = useMediaQuery()
  const { translations } = useLanguage()

  const currentZoom = mapRef?.current?._zoom || zoom
  const markerSize = currentZoom < 7
    ? 6
    : currentZoom < 10
      ? currentZoom - 1
      : currentZoom < 11
        ? 20
        : 32

  React.useEffect(() => {
    if (activeLocation?.location && !contextMenu && initiated && isNotPhone) {
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
    if (!isNotPhone && mapRef.current) {
      mapRef.current.invalidateSize()
      if (activeLocation?.location && initiated) {
        const newZoom = currentZoom < 11 ? 12 : undefined
        mapRef.current.flyTo(activeLocation.location, newZoom)
      }
    }
  }, [activeLocation, isDrawerOpen, isNotPhone])

  const handleLoadMapMarkers = async (newZoom: number, newBounds: any) => {
    // Check whether viewport really changed to prevent multiple requests for
    // the same data.
    if (JSON.stringify(newBounds) !== JSON.stringify(previousBounds)) {
      // Prevend getMarkers on zoom in, because the current ones can be used.
      // Load them anyway if this is the first call - previousBounds is not
      // defined, or when entering the details view on mobile - !isNotPhone && isDrawerOpen.
      if (newZoom <= currentZoom || !previousBounds || (!isNotPhone && isDrawerOpen)) {
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

  const MOBILE_MINI_MAP_HEIGHT = 200
  const LOCATION_TAB_WIDTH = 400
  const mapControlButtonClassName = 'flex items-center justify-center bg-white hover:bg-gray-100 size-[32px] !text-gray-600 rounded-sm cursor-pointer shadow-[0_0_0_2px_rgba(0,0,0,0.2)]'

  const mapOffsetStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-1rem',
    bottom: '-2rem',
    right: '-1rem',
  }

  return (
    // Use wrapper to set offset to load markers that are on the edge of a screen.
    <>
      <style>{`
        .map-container .leaflet-right { right: 1rem; }
        .map-container .leaflet-bottom { bottom: 2rem; }
        .map-container .leaflet-left { left: 1rem; }
        .map-container .leaflet-marker-icon { filter: drop-shadow(0 0 1px rgb(0,0,0)); }
        .map-container .leaflet-pixi-overlay { z-index: 1000; ${editMode ? 'display: none;' : 'display: block;'} }
        .map-popup .leaflet-popup-content-wrapper { background-color: transparent; border: none; }
        .map-popup .leaflet-popup-content-wrapper::after { content: ""; display: block; position: absolute; width: 20px; height: 1px; left: calc(50% - 10px); bottom: 0; background-color: white; }
        .map-popup .leaflet-popup-content { margin: 0; border-radius: 0; border: none; }
      `}</style>
      <div
        className="flex-grow relative"
        style={isDrawerOpen && !isNotPhone
          ? isPhone
            ? { height: MOBILE_MINI_MAP_HEIGHT }
            : { marginLeft: LOCATION_TAB_WIDTH }
          : {}
        }
      >
        <MapContainer
          whenCreated={(mapInstance: any) => { mapRef.current = mapInstance }}
          className="map-container"
          style={mapOffsetStyle}
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
            className="map-popup"
          >
            <Menu
              items={[
                {
                  label: translations.addMarkerHere,
                  callback: () => {
                    setContextMenu(false)
                    history.push('/location/new')
                    mapRef.current.setView(activeLocation.location)
                  },
                },
              ]}
            />
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
            className={classNames(
              mapControlButtonClassName,
              userLocation ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-60'
            )}
            onClick={() => userLocation &&
              mapRef.current.flyTo(userLocation, 14)
            }
          >
            {userLocation
              ? <LocateFixed size={17} strokeWidth={3} />
              : <LocateOff size={17} strokeWidth={3} />
            }
          </a>
        </Control>
        <Control position='topright' container={{ style: { display: ((!isDrawerOpen || !isPhone) && !editMode) ? 'block' : 'none' } }}>
          <Export markers={markers} className={mapControlButtonClassName} />
        </Control>
        <Control position='bottomright'>
          {userLocation && (!isDrawerOpen || !isPhone) &&
            <Typography
              variant='caption'
              className="bg-white/75 px-0.5 text-[11px]"
            >Dokładność GPS: {Math.round(locationAccuracy || 0)} m</Typography>
          }
        </Control>
        <ScaleControl position='bottomright' imperial={false} />
        <Control position='topleft' container={{ style: { display: (isNotPhone && !editMode) ? 'block' : 'none' } }}>
          <Legend boxed />
        </Control>
        </MapContainer>
      </div>
    </>
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

export default Map
