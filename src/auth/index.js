export class Auth {
  getLoggedStatus = () => {
    const user = localStorage.getItem('currentUser');

    if(user) {
      return JSON.parse(user);
    }

    return false;
  };

  logIn = (user, token) => {
    localStorage.setItem('currentUser', JSON.stringify({user, token}));
  }

  logOut = () => {
    localStorage.removeItem('currentUser');
  }

  getStoredPosition = () => {
    const position = localStorage.getItem('lastPosition');

    if(position) {
      return position.split(';');
    } else {
      return false;
    }
  }

  setStoredPosition = (lat, lng, zoom) => {
    localStorage.setItem('lastPosition', lat+';'+lng+';'+zoom);
  }
}
