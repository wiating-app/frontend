import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from "./react-auth0-wrapper";

const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
    <Auth0Provider
      domain="merito.eu.auth0.com"
      client_id="IpMRzFHzBdQzKfGYqLOqo0XBtzc4SWee"
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      responseType="token id_token"
      getTokenSilently={true}
    >
      <App />
    </Auth0Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
