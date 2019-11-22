import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'
import { strings } from '../lang/strings.js'


const Map = React.forwardRef((props, ref) => {
  const [mapInstance, setMapInstance] = React.useState()
  const [layer, setLayer] = React.useState()
  const [newMarkerLayer, setNewMarkerLayer] = React.useState()
  const [currentPointId, setCurrentPointId] = React.useState()

  const classes = useStyles()

  React.useEffect(() => {
    // Load map script. PHASE 1/2.
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
      // Load map script. PHASE 2/2.
      // After map instance is saved to state, configure additional map features
      // that require map itself.
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
          props.openContextMenu(e.data.event.clientX, e.data.event.clientY, coords)
          props.unsetCurrentLocation()
          setNewMarker(coords.x, coords.y)
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

      // On marker click
      map.getSignals().addListener(this, 'marker-click', function(e) {
        let id = e.target.getId()

        if ( id < 1 ) id = 0; // Hack for invalid ID returned from mapy.cz API

        setCurrentPointId(null)
        setCurrentPointId(id)
      })

      setMapInstance(map)
      setLayer(layer)
      loadMapMarkers()
    }
  }, [mapInstance, newMarkerLayer])


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


  React.useEffect(() => {
    if (currentPointId != null) {
      const { _id: id, _source } = props.points[currentPointId]
      const point = { id, ..._source }

      newMarkerLayer.removeAll()

      // Open Location tab.
      props.openLocationTab(point)

      // Center map on marker
      const newCenter = window.SMap.Coords.fromWGS84(point.location.lon, point.location.lat)
      mapInstance.setCenter(newCenter, true)
    }
  }, [currentPointId])


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
      const newCenter = window.SMap.Coords.fromWGS84(lon, lat)
      mapInstance.setCenter(newCenter, true)
    },
  }))


  const loadMapMarkers = () => {
    const viewport = mapInstance.getViewport()
    props.loadMapMarkers(viewport)
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
    <div id='map' className={classNames(classes.root, { [classes.condensed] : props.condensed })}>
      {(!mapInstance || !layer) &&
        <div className={classes.loading}>{strings.map.loading}</div>
      }
    </div>
  )
})

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  condensed: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: '70vh',
    },
  },
  loading: {
    textAlign: 'center',
    paddingTop: 20,
  },
}))

export default Map
