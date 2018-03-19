import { fetch, normalize } from 'utilities/foursquare';

export const START_SEARCH = 'START_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const ERROR_SEARCH = 'ERROR_SEARCH';
export const ADD_SEARCH = 'ADD_SEARCH';

export function startSearch(query, near) {
  return {
    type: START_SEARCH,
    query,
    near
  };
}

export function stopSearch(isEmpty) {
  return {
    type: STOP_SEARCH,
    isEmpty
  };
}

export function errorSearch(msg) {
  function replaceErrors(key, value) {
    if (value instanceof Error) {
      var error = {};
      Object.getOwnPropertyNames(value).forEach(function(key) {
        error[key] = value[key];
      });
      return error;
    }
    return value;
  }

  return {
    type: ERROR_SEARCH,
    isError: true,
    errorMsg: JSON.stringify(msg, replaceErrors)
  };
}

export function addSearch(query, near, normResp) {
  return {
    type: ADD_SEARCH,
    query,
    near,
    search: normResp.search,
    entities: normResp.entities
  };
}

export function fetchFoursquare(query, near) {
  return dispatch => {
    dispatch(startSearch(query, near));
    return fetch({
      endpoint: 'explore',
      params: { query: query, near: near, venuePhotos: true }
    })
      .then(response => normalize(response))
      .then(normResp => dispatch(addSearch(query, near, normResp)))
      .then(() => dispatch(stopSearch(false)))
      .catch(error => {
        dispatch(stopSearch(true));
        dispatch(errorSearch(error));
      });
  };
}
