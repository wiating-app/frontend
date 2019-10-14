import React from 'react';
import { API } from '../api';
import { Auth } from '../auth';

import { strings } from '../lang/strings.js';

const api = new API();
const auth = new Auth();

const SCRIPT_LOADING_NONE = 'NONE',
      SCRIPT_LOADING_RUNNING = 'RUNNING',
      SCRIPT_LOADING_DONE = 'DONE';

export class Map extends React.Component {

  static defaultProps = {
    scriptUrl: 'https://api.mapy.cz/loader.js'
  }

  constructor(props, context) {
    super(props, context);
    const isSMapDefined = typeof SMap !== 'undefined';

    this.state = {
      scriptLoadingState: isSMapDefined ? SCRIPT_LOADING_DONE : SCRIPT_LOADING_NONE
    };
  }

  onScriptLoaded = this.onScriptLoaded.bind(this)

  addMarker = (x, y) => {
    // Clear existing markers
    this.state.newMarkerLayer.removeAll();

    // Create custom pin icon
    const pointer = window.JAK.mel("div");
    const image = window.JAK.mel("img", {src:"/pin2.svg"});
    pointer.appendChild(image);

    const position = window.SMap.Coords.fromWGS84(x, y);

    // Create marker
    const marker = new window.SMap.Marker(position, "newPointMarker", {url: pointer});
    marker.decorate(window.SMap.Marker.Feature.Draggable);

    // Add marker to layer
    this.state.newMarkerLayer.addMarker(marker);

    this.setState({
      addMarker: marker
    })

    // Center map on marker
    this.state.map.setCenter(position, true);
  }

  clearAddMarker = () => {
    this.state.newMarkerLayer.removeAll();
  }

  // TODO: center on marker on panning (?)
  updateMarkerPosition = () => {
    if(this.state.addMarker) {
      this.state.newMarkerLayer.removeAll();
      this.state.addMarker.setCoords(this.state.map.getCenter());
      this.state.newMarkerLayer.addMarker(this.state.addMarker);
    }
  }

  loadMapMarkers = async (lbx, lby, rtx, rty) => {
    const viewport = this.state.map.getViewport();
    const points = await api.getMapPoints(viewport.lbx, viewport.lby, viewport.rtx, viewport.rty);

    this.state.layer.removeAll();

    // Crate markers
    for(let i = 0 ; i < points.length ; i++) {
      const point = points[i]._source;
      const coords = window.SMap.Coords.fromWGS84(point.location.lon, point.location.lat);
      const marker = new window.SMap.Marker(coords, i, {
        title: point.name
      });

      this.state.layer.addMarker(marker);
    }

    this.setState({
      points: points
    })
  }

  setMapCenter = (posX, posY) => {
    const newCenter = window.SMap.Coords.fromWGS84(posY, posX);
    this.state.map.setCenter(newCenter, true);
  }

  // Setup map on script loaded
  onScriptLoaded() {
    const map = this;

    window.Loader.async = true;
    window.Loader.load(null, {poi: this.props.poi}, async () => {

      let center;

      // Default map center
      const position = auth.getStoredPosition();

      let zoom = 13;

      if(position) {
        center = window.SMap.Coords.fromWGS84(position[0], position[1]);
        zoom = position[2];
      } else if(this.props.initCoords) {
        center = window.SMap.Coords.fromWGS84(this.props.initCoords.longitude, this.props.initCoords.latitude);
      } else {
        center = window.SMap.Coords.fromWGS84(16.844417, 50.39805);
      }

      this.setState({
        scriptLoadingState: SCRIPT_LOADING_DONE,
      })

      // Create map object
      const m = new window.SMap(window.JAK.gel("map"), center, zoom);
      m.addDefaultLayer(window.SMap.DEF_TURIST).enable();

      // Mouse control setup
      m.addControl(new window.SMap.Control.Mouse(window.SMap.MOUSE_PAN | window.SMap.MOUSE_WHEEL | window.SMap.MOUSE_ZOOM, {minDriftSpeed:1/0}));

      // Zoom setup
      m.addControl(new window.SMap.Control.Zoom({}, { titles: ["Przybliż", "Oddal"], showZoomMenu: false }), {right: "17px", top: "17px"});

      // Create existing locations markers layer
      const layer = new window.SMap.Layer.Marker();
      m.addLayer(layer);
      layer.enable();

      // Create new location marker layer
      const newMarkerLayer = new window.SMap.Layer.Marker();
      m.addLayer(newMarkerLayer);
      newMarkerLayer.enable();

      // Open context menu
      m.getSignals().addListener(window, "map-contextmenu", function click(e) {
        if(map.props.isLoggedIn) {
          const coords = window.SMap.Coords.fromEvent(e.data.event, m);
          map.props.onContextMenu(e.data.event.clientX, e.data.event.clientY, coords.x, coords.y);
        }
      });

      // Close context menu on map click
      m.getSignals().addListener(window, "map-click", function() {
        map.props.onContextMenuClose();
      });

      // Reload map markers on viewport change
      m.getSignals().addListener(window, "map-redraw", function() {
        map.loadMapMarkers();

        const pos = map.state.map.getCenter();
        const zoom = map.state.map.getZoom();
        auth.setStoredPosition(pos.x, pos.y, zoom);
      });

      m.getSignals().addListener(window, "marker-drag-move", function(e) {
        const coords = window.SMap.Coords.fromEvent(e.data.event, m);
        map.props.onUpdateMarkerPosition(coords.x, coords.y);
      });

      // Map panning action
      m.getSignals().addListener(window, "map-pan", function(e) {
        //map.updateMarkerPosition(); // TODO check UX behaviour
      });

      // On marker click
      m.getSignals().addListener(this, "marker-click", function(e) {
        const marker = e.target;
        let id = marker.getId();

        if(id<1) id = 0;

        if(map.state.points[id]) {
          let point = map.state.points[id]._source;

          point.id = map.state.points[id]._id

          map.state.newMarkerLayer.removeAll();
          map.props.openLocationTab(point)

          // Center map on marker
          const newCenter = window.SMap.Coords.fromWGS84(marker._coords.x, marker._coords.y);
          m.setCenter(newCenter, true);
        }
      });

      this.setState({
        mapCenter: center,
        map: m,
        layer: layer,
        newMarkerLayer: newMarkerLayer
      });

      // Initial load markers
      this.loadMapMarkers();

    });
  }

  // Async load map script
  loadScript() {
    const {scriptUrl} = this.props;
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', scriptUrl);
    scriptElement.addEventListener('load', this.onScriptLoaded);
    document.head.appendChild(scriptElement);

    this.setState({
      scriptLoadingState: SCRIPT_LOADING_RUNNING,
    });
  }

  componentDidMount() {
    const {scriptLoadingState} = this.state;

    if (scriptLoadingState !== SCRIPT_LOADING_NONE) {
      return;
    }

    if (typeof SMap === 'undefined') {
      this.loadScript();
    }
    else {
      this.setState({
        scriptLoadingState: SCRIPT_LOADING_DONE,
      });
    }

  }

  render() {
    if (this.state.scriptLoadingState === SCRIPT_LOADING_DONE) {
      return <div id="map" style={{height:"100%"}}></div>;
    } else {
      return (<div style={{textAlign: "center", paddingTop: 20}}>{ strings.map.loading }</div>);
    }
  }
}

export default Map;
