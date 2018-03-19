import { fetchFS, normalize } from 'utilities/foursquare';
import config from 'utilities/config';

// Out action list
export const START_SEARCH = 'START_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const ERROR_SEARCH = 'ERROR_SEARCH';
export const ADD_SEARCH = 'ADD_SEARCH';

/**
 * Redux action to start the search (visually).
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @return {object} An object with action type and query and near keywords
 */
function startSearch(query, near) {
  return {
    type: START_SEARCH,
    query,
    near
  };
}

/**
 * Redux action to stop the search (visually).
 * @param {boolean} isEmpty - Is the search results empty? Defaults to false.
 * @return {object} An object with action type and isEmpty flag
 */
function stopSearch(isEmpty = false) {
  return {
    type: STOP_SEARCH,
    isEmpty
  };
}

/**
 * Redux action to handle search errors
 * @param {object} msg - Error's message object
 * @return {object} An object with action type, isError flag and error message
 */
function errorSearch(msg) {
  /**
   * A little helper to parse the Error object. It will be supplied to the
   * Json.stringify as a second 'replacer' argument.
   */
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
    errorMsg: typeof msg == 'object' ? JSON.stringify(msg, replaceErrors) : msg
  };
}

/**
 * Redux action for adding a search result to the store
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @return {object} An object with action type, query and near keywords and
 * separated properties for the search and its entities.
 */
function addSearch(query, near, normResp) {
  return {
    type: ADD_SEARCH,
    query,
    near,
    search: normResp.search,
    entities: normResp.entities
  };
}

/**
 * This is a public (wrapper) function to organize the fetching and saving data
 * flow with a Promise based structure. The logic below is self-explanatory.
 * @param  {string} query - the 'looking for' keyword from the DOM input
 * @param  {string} near - the 'place' keyword from the DOM input
 */
export function fetchFoursquare(query, near) {
  return dispatch => {
    // First visually start the search
    dispatch(startSearch(query, near));

    // Then begin to fetch the data
    return (
      fetchFS({
        endpoint: 'explore',
        params: { query: query, near: near, venuePhotos: true }
      })
        // When the results arrive convert them to readebla json format
        .then(response => {
          return response.json();
        })

        .then(response => {
          // Check if there is any errors
          // see developer.foursquare.com/docs/api/troubleshooting/errors
          if (response.meta.code === 200) {
            // Check if there is any result
            if (response.response.totalResults == 0) {
              // If no results, stop the search with 'true' flag
              // to inform the UI that the results are empty.
              setTimeout(() => dispatch(stopSearch(true)), config.UI_delay);
            } else {
              // Otherwise stop the search and proceed with adding the results
              // to our Redux store
              setTimeout(() => {
                dispatch(stopSearch());
                dispatch(addSearch(query, near, normalize(response)));
              }, config.UI_delay);
            }
          } else {
            // If the server responds us with a satuts code othan than 200
            // proceed with error handling
            dispatch(stopSearch());
            dispatch(errorSearch(response.meta.errorDetail));
          }
        })

        // If any errros happened during the process
        // stop the search and parse the errors
        .catch(error => {
          dispatch(stopSearch());
          dispatch(errorSearch(error));
        })
    );
  };
}
