import { push } from 'react-router-redux';
import { fetchFS, normalize } from 'utilities/foursquare';
import { saveStorage, clearStorage } from 'utilities/localstorage';
import { capitalize, isUndefined } from 'utilities/helpers';
import config from 'utilities/config';

// Action list
export const START_SEARCH = 'START_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const UPDATE_SEARCH = 'UPDATE_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const BEEP_SEARCH = 'BEEP_SEARCH';
export const SAVE_SEARCH = 'SAVE_SEARCH';
export const CLEAR_ALL = 'CLEAR_ALL';

/**
 * Redux action to start the search.
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @return {object} An object with action type and query and near keywords
 */
export const startSearch = (query, near) => {
  return {
    type: START_SEARCH,
    query,
    near
  };
};

/**
 * Action to stop the search (visually).
 * @return {object} An object with just an action type
 */
export const stopSearch = () => {
  return { type: STOP_SEARCH };
};

/**
 * Action to update the search.
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @param {string} searchId - the ID of the current search
 * @return {object} An object with just an action type
 */
export const updateSearch = (query, near, searchId) => {
  return {
    type: UPDATE_SEARCH,
    query,
    near,
    id: searchId
  };
};

/**
 * Action to reset the current search.
 * @return {object} An object with just an action type
 */
export const clearSearch = () => {
  return { type: CLEAR_SEARCH };
};

/**
 * Action to handle the messages, warnings and errors.
 * @param {number} type - Message's importance on a 0 to 2 scale:
 * Notifications (0), warnings (1) and errors (2)
 * @param {object/string} text - Message text
 * @param {string} title - Message title (Optional)
 * @return {object} An object with action type, message type and text
 */
export const beepSearch = (type, text, title = '') => {
  /**
   * A little helper to parse the Error object. It will be supplied to the
   * Json.stringify as a second 'replacer' argument.
   */
  const replaceErrors = (key, value) => {
    if (value instanceof Error) {
      var error = {};
      Object.getOwnPropertyNames(value).forEach(function(key) {
        error[key] = value[key];
      });
      return error;
    }
    return value;
  };

  return {
    type: BEEP_SEARCH,
    msgType: type,
    msgTitle: title,
    msgText:
      type == 2
        ? typeof text == 'object' ? JSON.stringify(text, replaceErrors) : text
        : text
  };
};

/**
 * Action for adding a search result to the store
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @return {object} An object with action type, query and near keywords and
 * separated properties for the search and its entities.
 */
export const saveSearch = (query, near, normResp) => {
  return {
    type: SAVE_SEARCH,
    query,
    near,
    search: normResp.search,
    entities: normResp.entities
  };
};

/**
 * Action to save the 'searches' and 'entities' to localstorage
 * @return  {function}
 */
export const saveStateToLocalstorage = () => {
  return (dispatch, getState) => {
    const currentState = getState();
    saveStorage({
      searches: currentState.searches,
      entities: currentState.entities
    });
  };
};

/**
 * Action to fetch data from Foursquare.
 * This is a wrapper function to organize the fetching and saving
 * data flow with a Promise based structure. The logic below is
 * self-explanatory.
 * @param  {string} query - the 'looking for' keyword from the DOM input
 * @param  {string} near - the 'place' keyword from the DOM input
 * @return  {function}
 */
export const fetchFoursquare = (query, near) => {
  return dispatch => {
    // First visually start the search
    dispatch(startSearch(query, near));

    // Then begin to fetch the data
    return (
      fetchFS({
        endpoint: 'explore',
        params: {
          query: query,
          near: near,
          limit: config.foursquare_api.limit,
          venuePhotos: true
        }
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
              // If no results, stop the search and inform the UI
              // that the results are empty.
              setTimeout(() => {
                dispatch(stopSearch());
                dispatch(
                  beepSearch(1, config.UI.messages.no_results_found_text)
                );
              }, config.UI.delay);
            } else {
              // Otherwise stop the search, save the results to the Redux store
              // and change the url to search/:id
              setTimeout(() => {
                dispatch(stopSearch());
                dispatch(saveSearch(query, near, normalize(response)));
                dispatch(saveStateToLocalstorage());
                dispatch(goSearch(response.meta.requestId, query, near));
              }, config.UI.delay);
            }
          } else {
            // If the server responds us with a satuts code othan than 200
            // proceed with error handling
            dispatch(stopSearch());
            dispatch(
              beepSearch(
                2,
                response.meta.errorDetail,
                config.UI.messages.api_response_title
              )
            );
          }
        })

        // If any errros happened during the process
        // stop the search and parse the errors
        .catch(error => {
          dispatch(stopSearch());
          dispatch(beepSearch(3, error, config.UI.messages.error_title));
        })
    );
  };
};

/**
 * Clears the current search and go back to home
 */
export const goHome = () => {
  return dispatch => {
    dispatch(push('/'));
  };
};

/**
 * Go to a specific search page

 */
export const goSearch = (id, query, near) => {
  return dispatch => {
    dispatch(push('/' + config.app.endpoints.search + '/' + id));
  };
};

/**
 * Clears Redux store
 * @return {object} An object with just an action type
 */
export const clearStore = () => {
  return { type: CLEAR_ALL };
};

/**
 * Clears Redux store and localstorage, returns to home
 * and congratulates you for all you've done.
 */
export const clearAll = () => {
  return dispatch => {
    dispatch(goHome());
    dispatch(clearStore());
    clearStorage();
    dispatch(beepSearch(0, config.UI.messages.cleared_all));
  };
};
