import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { Icon, LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed, LocateOff } from 'lucide-react'
import { Circle, MapContainer, Marker, Popup, ScaleControl, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet'
import Control from 'react-leaflet-custom-control'
import PixiOverlay from 'react-leaflet-pixi-overlay'
import { useRecoilState } from 'recoil'
import history from '../history'
import { activeLocationState, editModeState, isDrawerOpenState } from '../state'
import { Location } from '../typings'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'
import useMediaQuery from '../utils/useMediaQuery'
import Export from './Export'
import GridDebugLayer from './GridDebugLayer'
import Legend from './Legend'
import MapLoadingIndicator from './MapLoadingIndicator'
import Menu from './Menu'
import Typography from './Typography'

interface MapProps {
  center?: [number, number]
  zoom?: number
  bounds?: any
  isLoggedIn: boolean
  userLocation?: [number, number]
  markers: Location[]
  markersLoading?: boolean
  locationAccuracy?: number
  onBoundsChange?: (bounds: LatLngBounds) => void
  setStoredPosition: (coords: any) => void
  activeTypes: any[]
  currentBounds?: LatLngBounds | null
}

const Map = ({
  center = [50.39805, 16.844417], // The area of Polish mountains.
  zoom = 7,
  bounds,
  isLoggedIn,
  userLocation,
  markers,
  markersLoading = false,
  locationAccuracy,
  onBoundsChange,
  setStoredPosition,
  activeTypes,
  currentBounds,
}: MapProps) => {
  const [contextMenu, setContextMenu] = React.useState<boolean>(false)
  const [previousBounds, setPreviousBounds] = React.useState<LatLngBounds | undefined>()

  // Filter markers by activeTypes
  const filteredMarkers = React.useMemo(() => {
    // If activeTypes is empty, show all markers
    if (activeTypes.length === 0) {
      return markers
    }

    return markers.filter(marker => {
      return marker.type !== undefined && activeTypes.includes(marker.type)
    })
  }, [markers, activeTypes])

  const mapRef = React.useRef<any>()
  const initiated = !!mapRef?.current
  const initialPositioningStateRef = React.useRef<'not_started' | 'in_progress' | 'complete'>('not_started')
  const [editMode] = useRecoilState(editModeState)
  const queryClient = useQueryClient()
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)
  const { isPhone, isNotPhone } = useMediaQuery()
  const { translations } = useLanguage()

  const currentZoom = mapRef?.current?._zoom || zoom
  const markerSize = currentZoom < 7 ? 6 : currentZoom < 10 ? currentZoom - 1 : currentZoom < 11 ? 20 : 32

  React.useEffect(() => {
    if (activeLocation?.location && !contextMenu && initiated && isNotPhone) {
      const newZoom = currentZoom < 10 ? 11 : undefined
      mapRef.current.flyTo(activeLocation.location, newZoom)
    }
  }, [activeLocation])

  // Only apply center/bounds on initial mount, not on every prop change
  // This prevents the map from jumping back to stored position when user pans
  React.useEffect(() => {
    if (initialPositioningStateRef.current === 'not_started' && initiated) {
      const handleAnimationComplete = () => {
        if (initialPositioningStateRef.current !== 'complete') {
          initialPositioningStateRef.current = 'complete'
          // Get bounds and trigger marker loading after initial positioning is complete
          const initialBounds = mapRef.current.getBounds()
          onBoundsChange?.(initialBounds)
        }
      }

      if (bounds && !activeLocation) {
        // Bounds take precedence over center
        mapRef.current.flyToBounds(bounds)
        initialPositioningStateRef.current = 'in_progress'
        // Listen for moveend event to detect when animation completes
        mapRef.current.once('moveend', handleAnimationComplete)
      } else if (center && !activeLocation) {
        mapRef.current.flyTo(center)
        initialPositioningStateRef.current = 'in_progress'
        // Listen for moveend event to detect when animation completes
        mapRef.current.once('moveend', handleAnimationComplete)
      } else {
        // No initial positioning needed, mark as complete immediately
        initialPositioningStateRef.current = 'complete'
        // Get initial bounds and trigger marker loading
        const initialBounds = mapRef.current.getBounds()
        onBoundsChange?.(initialBounds)
      }
    }
  }, [center, bounds, initiated, activeLocation, onBoundsChange])

  React.useEffect(() => {
    if (!isNotPhone && mapRef.current) {
      mapRef.current.invalidateSize()
      if (activeLocation?.location && initiated) {
        const newZoom = currentZoom < 11 ? 12 : undefined
        mapRef.current.flyTo(activeLocation.location, newZoom)
      }
    }
  }, [activeLocation, isDrawerOpen, isNotPhone])

  const handleLoadMapMarkers = async (newZoom: number, newBounds: LatLngBounds) => {
    // Don't trigger marker loading during initial positioning animation
    // Use ref for synchronous check to avoid race conditions
    if (initialPositioningStateRef.current !== 'complete') {
      return
    }

    onBoundsChange?.(newBounds)
    setStoredPosition({ bounds: newBounds, zoom: newZoom })
    setPreviousBounds(newBounds)
  }

  React.useEffect(() => {
    // Refresh markers when active types change.
    // Only do this after initial positioning is complete
    if (initialPositioningStateRef.current === 'complete' && initiated && onBoundsChange) {
      const bounds = mapRef.current.getBounds()
      // Trigger bounds change to reload markers with new activeTypes
      onBoundsChange(bounds)
    }
  }, [activeTypes, initiated, onBoundsChange])

  const MOBILE_MINI_MAP_HEIGHT = 200
  const LOCATION_TAB_WIDTH = 400
  const mapControlButtonClassName =
    'flex items-center justify-center bg-white hover:bg-gray-100 size-[32px] !text-gray-600 rounded-full cursor-pointer shadow-[0_0_0_2px_rgba(0,0,0,0.2)]'

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
        className="relative flex-grow"
        style={
          isDrawerOpen && !isNotPhone
            ? isPhone
              ? { height: MOBILE_MINI_MAP_HEIGHT }
              : { marginLeft: LOCATION_TAB_WIDTH }
            : {}
        }
      >
        <MapLoadingIndicator isLoading={markersLoading} />
        <MapContainer
          whenCreated={(mapInstance: any) => {
            mapRef.current = mapInstance
          }}
          className="map-container"
          style={mapOffsetStyle}
          center={center}
          zoom={zoom}
          minZoom={5}
          maxZoom={18}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          zoomControl={false}
          id="cy-map"
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
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          />
          <GridDebugLayer bounds={currentBounds || previousBounds || bounds} />
          <PixiOverlay
            markers={
              filteredMarkers.map(item => {
                const {
                  location: { lat, lng },
                  id,
                  type,
                } = item
                return {
                  id,
                  customIcon: generateMarkerIcon(type, markerSize),
                  iconId: `${type}_${markerSize}`,
                  position: [lat, lng],
                  onClick: () => {
                    queryClient.setQueryData(['searchResults'], [])
                    setActiveLocation(item)
                    history.push(`/location/${item.id}`)
                    setContextMenu(false)
                  },
                }
              }) || []
            }
          />
          {activeLocation && (
            <Marker
              icon={
                new Icon({
                  iconUrl: '/active-location.svg',
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                })
              }
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
          )}
          {activeLocation && contextMenu && (
            <Popup position={activeLocation.location} closeButton={false} className="map-popup">
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
          )}
          {userLocation && (
            <>
              {locationAccuracy && locationAccuracy > 150 && (
                <Circle
                  center={userLocation}
                  radius={locationAccuracy}
                  pathOptions={{
                    weight: 1,
                    color: '#3388ff',
                    fillColor: '#3388ff',
                    fillOpacity: 0.1,
                  }}
                />
              )}
              <Marker
                icon={
                  new Icon({
                    iconUrl: '/current-location.svg',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                  })
                }
                zIndexOffset={1000}
                position={userLocation}
              />
            </>
          )}
          {(!isDrawerOpen || !isPhone) && <ZoomControl position="topright" />}
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
          <Control position="topright" container={{ style: { display: !isDrawerOpen || !isPhone ? 'block' : 'none' } }}>
            <a
              className={classNames(
                mapControlButtonClassName,
                userLocation ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-60',
              )}
              onClick={() => userLocation && mapRef.current.flyTo(userLocation, 14)}
            >
              {userLocation ? <LocateFixed size={17} strokeWidth={2.5} /> : <LocateOff size={17} strokeWidth={2.5} />}
            </a>
          </Control>
          <Control
            position="topright"
            container={{ style: { display: (!isDrawerOpen || !isPhone) && !editMode ? 'block' : 'none' } }}
          >
            <Export markers={filteredMarkers} className={mapControlButtonClassName} />
          </Control>
          <Control position="bottomright">
            {userLocation && (!isDrawerOpen || !isPhone) && locationAccuracy && locationAccuracy > 150 && (
              <Typography variant="caption" className="bg-white/75 px-0.5 text-[11px]">
                Dokładność GPS: {Math.round(locationAccuracy || 0)} m
              </Typography>
            )}
          </Control>
          <ScaleControl position="bottomright" imperial={false} />
          <Control position="topleft" container={{ style: { display: activeLocation ? 'none' : 'block' } }}>
            <Legend />
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
  handleLoadMapMarkers: (zoom: number, bounds: LatLngBounds) => void
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
          setActiveLocation(contextMenu ? null : ({ location: e.latlng } as Location))
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
