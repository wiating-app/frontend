import React, { Component } from 'react';
import './App.css';

import { Auth } from './auth';

import Map from './components/map.jsx';
import ContextMenu from './components/contextmenu.js';
import LocationTab from './components/locationtab.js';
import { useAuth0 } from './react-auth0-wrapper';
import { geolocated } from "react-geolocated";

import NavBar from "./components/navbar";

const auth = new Auth();


function AuthComponent(props) {
  const { loading, getTokenSilently, user } = useAuth0();
  const logged = auth.getLoggedStatus();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  if (!logged) {
    getTokenSilently().then((token) => {
      console.log('my token', token)
      props.onLogin(user.name,);
      auth.logIn(user.name, token)
    })
  } else {
    getTokenSilently().then((token) => {
        console.log('ttt', token)
    })
  }

  return (
    <NavBar state={props.state} onLogout={props.onLogout}/>
  )
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      contextMenuX: 0,
      contextMenuY: 0,
      contextMenuOpen: false,
      addMarkerX: 0,
      addMarkerY: 0
    };
  }

  openContextMenu = (x, y, px, py) => {
    this.setState({
      contextMenuX: x,
      contextMenuY: y,
      addMarkerX: px,
      addMarkerY: py,
      contextMenuOpen: true
    })
  }

  closeContextMenu = (x, y) => {
    this.setState({
      contextMenuOpen: false
    })
  }

  openLocationTab = (point) => {
    this.setState({
      locationTabOpen: true,
      currentLocation: point
    })

    this.refs.tab.openLocationTab(point);
  }

  addMarker = async (x, y) => {
    this.refs.map.addMarker(this.state.addMarkerX, this.state.addMarkerY);
    this.refs.tab.showMarkerForm();

    this.setState({
      contextMenuOpen: false
    })
  }

  refreshMap = async () => {
    this.refs.map.clearAddMarker();
    this.refs.map.loadMapMarkers();
  }

  onUpdateMarkerPosition = (x, y) => {
    this.setState({
      addMarkerX: x,
      addMarkerY: y
    })
  }

  onLogin = (name) => {
    this.setState({
      loggedIn: true,
      username: name
    })
  }

  onLogout = () => {
    auth.logOut();

    this.setState({
      loggedIn: false,
      username: false
    })
  }

  componentDidMount = () => {
    const logged = auth.getLoggedStatus();

    if(logged) {
      this.setState({
        loggedIn: true,
        username: logged.user
      })
    }
  }

  render() {
    return (
      <div className="App">

      <AuthComponent onLogin={this.onLogin} onLogout={this.onLogout} state={this.state}/>

      <div style={{boxSizing: 'border-box', paddingTop: 55, height: "100vh", position: "relative"}}>
        <Map
          onContextMenuClose={this.closeContextMenu}
          onContextMenu={this.openContextMenu}
          openLocationTab={this.openLocationTab}
          onUpdateMarkerPosition={this.onUpdateMarkerPosition}
          isLoggedIn={this.state.loggedIn}
          initCoords={this.props.coords}
          ref="map"
        />

        <LocationTab
          open={this.state.locationTabOpen}
          location={this.state.currentLocation}
          addMarkerX={this.state.addMarkerX}
          addMarkerY={this.state.addMarkerY}
          refreshMap={this.refreshMap}
          ref="tab"
          loggedIn={this.state.loggedIn}
        />
      </div>

      { this.state.contextMenuOpen &&
        <ContextMenu
          addMarker={this.addMarker}
          x={this.state.contextMenuX}
          y={this.state.contextMenuY}
        /> }

      </div>
    );
  }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(App);
