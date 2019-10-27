import React from 'react'
import { strings } from '../lang/strings.js'

const Map = React.forwardRef((props, ref) => {
  const [mapInstance, setMapInstance] = React.useState()
  const [layer, setLayer] = React.useState()
  const [newMarkerLayer, setNewMarkerLayer] = React.useState()

  React.useEffect(() => {
    // Load map script.
    const scriptElement = document.createElement('script')
    scriptElement.setAttribute('src', 'https://api.mapy.cz/loader.js')
    scriptElement.addEventListener('load', () => {
      window.Loader.async = true
      // Initiate map after script is loaded.
      window.Loader.load(null, {}, async () => {
        let center
        const position = props.getStoredPosition()
        let zoom = 13

        if (position) {
          center = SMap.Coords.fromWGS84(position[0], position[1])
          zoom = position[2]
        } else if (props.initCoords) {
          center = SMap.Coords.fromWGS84(props.initCoords.longitude, props.initCoords.latitude)
        } else {
          center = SMap.Coords.fromWGS84(16.844417, 50.39805)
        }
        // Create map instance and save it to state
        const _mapInstance = new SMap(JAK.gel('map'), center, zoom)
        setMapInstance(_mapInstance)

        // Create new location marker layer and save it to state
        const _newMarkerLayer = new window.SMap.Layer.Marker()
        _mapInstance.addLayer(_newMarkerLayer)
        _newMarkerLayer.enable()
        setNewMarkerLayer(_newMarkerLayer)
      })
    })
    document.head.appendChild(scriptElement)
  }, [])

  React.useEffect(() => {
    if (mapInstance && newMarkerLayer) {
      // Configure additional map features that require map itself, after map
      // instance is lsaved to state.
      let map = mapInstance
      map.addDefaultLayer(SMap.DEF_TURIST).enable()

      // Mouse control setup
      map.addControl(new SMap.Control.Mouse(window.SMap.MOUSE_PAN | window.SMap.MOUSE_WHEEL | window.SMap.MOUSE_ZOOM, { minDriftSpeed: 1 / 0 }))

      // Zoom setup
      map.addControl(new SMap.Control.Zoom({}, { titles: ['Przybliż', 'Oddal'], showZoomMenu: false }), { right: '17px', top: '17px' })

      // Create existing locations markers layer
      const layer = new SMap.Layer.Marker()
      map.addLayer(layer)
      layer.enable()

      // Open context menu
      map.getSignals().addListener(window, 'map-contextmenu', function click(e) {
        if (props.isLoggedIn) {
          const coords = window.SMap.Coords.fromEvent(e.data.event, map)
          props.openContextMenu(e.data.event.clientX, e.data.event.clientY, coords.x, coords.y)
          addMarker(coords)
        }
      })

      // Close context menu on map click
      map.getSignals().addListener(window, 'map-click', function() {
        props.closeContextMenu()
      })

      // Reload map markers on viewport change
      map.getSignals().addListener(window, 'map-redraw', function() {
        loadMapMarkers()

        const pos = mapInstance.getCenter()
        const zoom = mapInstance.getZoom()
        props.setStoredPosition(pos.x, pos.y, zoom)
      })

      map.getSignals().addListener(window, 'marker-drag-move', function(e) {
        const coords = window.SMap.Coords.fromEvent(e.data.event, map)
        props.onUpdateMarkerPosition(coords.x, coords.y)
      })

      // Map panning action
      map.getSignals().addListener(window, 'map-pan', function(e) {
        // updateMarkerPosition(); // TODO check UX behaviour
      })

      // On marker click
      map.getSignals().addListener(this, 'marker-click', function(e) {
        const marker = e.target
        let id = marker.getId()

        if (id < 1) id = 0

        if (map.state.props[id]) {
          const point = map.props.points[id]._source

          point.id = map.props.points[id]._id

          // newMarkerLayer.removeAll()
          props.openLocationTab(point)

          // Center map on marker
          const newCenter = window.SMap.Coords.fromWGS84(marker._coords.x, marker._coords.y)
          map.setCenter(newCenter, true)
        }
      })

      setMapInstance(map)
      setLayer(layer)

      // Initial load markers
      loadMapMarkers()
    }
  }, [mapInstance, newMarkerLayer])

  const loadMapMarkers = () => {
    const viewport = mapInstance.getViewport()
    props.loadMapMarkers(viewport)
  }

  React.useEffect(() => {
    // Process markers after new points are fetched.
    if (layer && props.points) {
      layer.removeAll()

      for (let i = 0; i < props.points.length; i++) {
        const point = props.points[i]._source
        const coords = window.SMap.Coords.fromWGS84(point.location.lon, point.location.lat)
        const marker = new window.SMap.Marker(coords, i, {
          title: point.name,
        })

        layer.addMarker(marker)
      }
    }
  }, [props.points, layer])

  React.useImperativeHandle(ref, () => ({
    clearAddMarker() {
      alert('clearAddMarker()')
    },
    loadMapMarkers() {
      alert('loadMapMarkers()')
    },
    setMapCenter() {
      alert('setMapCenter()')
    },
  }))

  const addMarker = coords => {
    // Clear existing markers
    newMarkerLayer.removeAll()

    // Create custom pin icon
    const pointer = window.JAK.mel('div')
    const image = window.JAK.mel('img', { src: '/pin2.svg' })
    pointer.appendChild(image)

    const position = window.SMap.Coords.fromWGS84(coords.x, coords.y)

    // Create marker
    const marker = new window.SMap.Marker(position, 'newPointMarker', { url: pointer })
    marker.decorate(window.SMap.Marker.Feature.Draggable)

    // Add marker to layer
    newMarkerLayer.addMarker(marker)

    // Center map on marker
    mapInstance.setCenter(position, true)
  }

  const clearAddMarker = () => {
    newMarkerLayer.removeAll()
  }

  const setMapCenter = (posX, posY) => {
    const newCenter = window.SMap.Coords.fromWGS84(posY, posX)
    mapInstance.setCenter(newCenter, true)
  }

  return (
    <div id='map' style={{ height: '100%' }}>
      {(!mapInstance || !layer) &&
        <div style={{ textAlign: 'center', paddingTop: 20 }}>{strings.map.loading}</div>
      }
    </div>
  )
})

export default Map
