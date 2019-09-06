import React, { Component } from 'react';
import styled from 'styled-components'
import './App.css';


import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import GoogleLogin from 'react-google-login';

import Map from './components/map.jsx';
import ContextMenu from './components/contextmenu.js';
import LocationTab from './components/locationtab.js';

const Nav = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  z-index: 999;
  width: 100%;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  background: #fff;
`;

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

    this.refs.tab.openLocationTab();
  }

  addMarker = (x, y) => {
    this.refs.map.addMarker(this.state.addMarkerX, this.state.addMarkerY);
    this.refs.tab.showMarkerForm();

    this.setState({
      contextMenuOpen: false
    })

    return false;
  }

  onSubmitMarker = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

  }

  onUpdateMarkerPosition = (x, y) => {
    this.setState({
      addMarkerX: x,
      addMarkerY: y
    })
  }

  onFacebookLogin = (response) => {
    console.log(response);

    this.setState({
      loggedIn: true
    })
  }

  onGoogleLogin = (response) => {
    console.log(response);

    this.setState({
      loggedIn: true
    })
  }

  render() {
    return (
      <div className="App">

      <Nav>
        <FacebookLogin
          appId="2545536718903046" //APP ID NOT CREATED YET
          fields="name,email,picture"
          callback={this.onFacebookLogin}
          render={renderProps => (
            <button onClick={renderProps.onClick}>Zaloguj z Google</button>
          )}
        />

        <GoogleLogin
          clientId="" //CLIENTID NOT CREATED YET
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={this.onGoogleLogin}
          onFailure={this.onGoogleLogin}
          render={renderProps => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Zaloguj Facebookiem</button>
          )}
        />
      </Nav>

      <div style={{boxSizing: 'border-box', paddingTop: 40, height: "100vh", position: "relative"}}>
        <Map onContextMenuClose={this.closeContextMenu} onContextMenu={this.openContextMenu} openLocationTab={this.openLocationTab} onUpdateMarkerPosition={this.onUpdateMarkerPosition} ref="map" />
        <LocationTab open={this.state.locationTabOpen} location={this.state.currentLocation} addMarkerX={this.state.addMarkerX} addMarkerY={this.state.addMarkerY} ref="tab"/>
      </div>

      { this.state.contextMenuOpen && <ContextMenu addMarker={this.addMarker} x={this.state.contextMenuX} y={this.state.contextMenuY} /> }


      </div>
    );
  }
}

export default App;
