import { timeoutPromise } from '../utils/promise.js';
import { Auth } from '../auth';

const auth = new Auth();

export class API {
  constructor(endPoints = {}, getToken = () => {}) {
    this.endPoints = endPoints;
    this.getToken = getToken;
  }

  get = (endPoint, options = {}) => {
    const promise = fetch(`${endPoint}${options.query || ''}`, options);
    if (options.timeout) {
      return timeoutPromise(promise, options.timeout);
    }

    return promise;
  };

  getObject = async (endPoint, options) => {
    const response = await this.get(endPoint, options);
    return response.json();
  };

  post = (endPoint, options = {}) =>
    this.get(endPoint, {
      method: 'POST',
      ...options
    });

  postObject = (obj, endPoint, options = {}) =>
    this.getObject(endPoint, {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...options.headers
      },
      body: JSON.stringify(obj)
    });

  uploadObject = (obj, endPoint, options = {}) =>
    this.getObject(endPoint, {
      method: 'POST',
      ...options,
      headers: {
        ...options.headers
      },
      body: obj
    });

  addPoint = async (data) => {
    const logged = auth.getLoggedStatus();

    if(logged) {
      const response = await this.postObject(data, process.env.REACT_APP_API_URL + '/wiating/add_point', {
        headers: { Authorization: "Bearer " + logged.token }
      });

      return response.body;
    } else {
      return false;
    }
  }

  updatePoint = async (data) => {
    const logged = auth.getLoggedStatus();

    if(logged) {
      const response = await this.postObject(data, process.env.REACT_APP_API_URL + '/wiating/modify_point', {
        headers: { Authorization: "Bearer " + logged.token }
      });

      return response.body;
    } else {
      return false;
    }
  }

  uploadImages = async (point, images) => {
    const logged = auth.getLoggedStatus();

    let data = new FormData()
    data.append('file', images[0])

    if(logged) {
      const response = await this.uploadObject(data, process.env.REACT_APP_API_URL + '/wiating/add_image/' + point, {
        headers: { Authorization: "Bearer " + logged.token }
      });

      return response;
    } else {
      return false;
    }
  }

  getMapPoints = async (lbx, lby, rtx, rty) => {
    const response = await this.postObject({
      top_right: {
        lat: rty,
        lon: rtx
      },
      bottom_left: {
        lat: lby,
        lon: lbx
      }
    }, process.env.REACT_APP_API_URL + '/wiating/get_points');

    return response.points;
  };

  search = async (phrase) => {
    const response = await this.postObject({
      phrase: phrase
    }, process.env.REACT_APP_API_URL + '/wiating/search_points');

    return response.points;
  };
}
