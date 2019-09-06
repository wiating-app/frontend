export class Auth {
  getLoggedStatus = () => {
    const user = localStorage.getItem('currentUser');

    if(user) {
      return JSON.parse(user);
    }

    return false;
  };

  logIn = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logOut = () => {
    localStorage.removeItem('currentUser');
  }
}
