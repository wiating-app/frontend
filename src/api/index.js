import { timeoutPromise } from '../utils/promise.js';

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

  getMapPoints = async (lbx, lby, rtx, rty) => {
    const response = await this.getObject(
      `/data.json`
    );

    console.info('API: Load points from API lbx: ' + lbx + ' lby: ' + lby + ' rtx: ' + rtx + ' rty: ' + rty)

    return response.points;
  };
}
