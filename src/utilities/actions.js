import { push } from 'react-router-redux';
import { fetchFS } from 'utilities/foursquare';
import { normalizeExplore, normalizeVenue } from 'utilities/normalizers';
import { saveStorage, clearStorage } from 'utilities/localstorage';
import { capitalize, isUndefined, isEmptyObj } from 'utilities/helpers';
import config from 'utilities/config';

// Action list
export const START_FETCH = 'START_FETCH';
export const STOP_FETCH = 'STOP_FETCH';
export const UPDATE_FETCH = 'UPDATE_FETCH';
export const SAVE_SEARCH = 'SAVE_SEARCH';
export const SAVE_VENUE = 'SAVE_VENUE';
export const CLEAR_FETCH = 'CLEAR_FETCH';
export const CLEAR_ALL = 'CLEAR_ALL';
export const BEEP = 'BEEP';

/**
 * Redux action to start any fetch.
 * @param {string} query - the FS keyword 'query', what are we looking for?
 * @param {string} near - the FS keyword 'near', where are looking?
 * @param {string} venueId - the FS 'id' of the venue to look for
 * @return {object} An object with action type and query and near keywords
 */
export const startFetch = (query, near, venueId) => {
  return {
    type: START_FETCH,
    query,
    near,
    venueId
  };
};

/**
 * Action to stop the fetch (visually).
 * @return {object} An object with just an action type
 */
export const stopFetch = () => {
  return { type: STOP_FETCH };
};

/**
 * Action to update the fetch.
 * @param {string} query - the FS keyword 'query', what are we looking for?
 * @param {string} near - the FS keyword 'near', where are looking?
 * @param {string} searchId - the ID of the current search
 * @param {string} venueId - the ID of the current venue
 * @return {object} An object with just an action type
 */
export const updateFetch = (query, near, searchId, venueId) => {
  return {
    type: UPDATE_FETCH,
    query,
    near,
    searchId,
    venueId
  };
};

/**
 * Action to add a fetched search result to the store
 * @param {object} normalizedResponse - the response from the 'normalizeExplore' method which contains the 'search' property
 * @return {object} An object with action type, query, near, location keywords and
 * the separated properties for the search and its entities.
 */
export const saveSearch = normalizedResponse => {
  return {
    type: SAVE_SEARCH,
    query: normalizedResponse.search.query,
    near: normalizedResponse.search.near,
    location: normalizedResponse.search.location,
    search: normalizedResponse.search,
    entities: normalizedResponse.entities
  };
};

/**
 * Action to add a fetched search result to the store
 * @param {object} normalizedResponse - the response from the
 * 'normalizeExplore' method which contains the 'search' property
 * @param {string} venueId - The unique id of the venue
 * @return {object} An object with action type, venueId and new entities with
 * a venue item containing photos or tips.
 */
export const saveVenue = (normalizedResponse, venueId) => {
  return {
    type: SAVE_VENUE,
    venueId: venueId,
    entities: normalizedResponse.entities
  };
};

/**
 * Action to reset the current fetch.
 * @return {object} An object with just an action type
 */
export const clearFetch = () => {
  return { type: CLEAR_FETCH };
};

/**
 * Action to handle the messages, warnings and errors.
 * @param {number} type - Message's importance on a 0 to 3 scale:
 * Success (0), Notification (1), warning (2) and error (3)
 * @param {object/string} text - Message text
 * @param {string} title - Message title (Optional)
 * @return {object} An object with action type, message type and text
 */
export const beep = (type, text, title = '') => {
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
    type: BEEP,
    msgType: type,
    msgTitle: title,
    msgText:
      type == 3
        ? typeof text == 'object' ? JSON.stringify(text, replaceErrors) : text
        : text
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
 * This is a long wrapper function to organize the fetching and saving
 * data flow with a Promise based structure. The logic below is
 * self-explanatory.
 * @param  {string} params.endpoint - 'Explore', 'photos' or 'tips'
 * @param  {string} params.query - What are we looking for?
 * @param  {string} params.near - Where are we looking for?
 * @param  {string} params.venueId - Unique (Foursquare) ID of the venue
 * @param  {number} params.offset - Paging offset of the tips
 * @return  {function}
 */
export const fetchFoursquare = (params = {}) => {
  return dispatch => {
    if (isEmptyObj(params)) return;

    const { endpoint, query, near, venueId } = params;
    const offset = isUndefined(params.offset) ? 0 : params.offset;
    let fetchParams = {};

    // Different endpoints, different fetch parameters
    if (endpoint == 'explore') {
      fetchParams = {
        endpoint: 'explore',
        params: {
          query: query,
          near: near,
          limit: config.foursquare_api.limit,
          offset: offset,
          venuePhotos: true
        }
      };
    } else if (endpoint == 'photos' || endpoint == 'tips') {
      fetchParams = {
        endpoint: venueId,
        field: endpoint,
        params: {
          group: 'venue',
          limit: config.foursquare_api.limit,
          offset: offset
        }
      };
    }

    // First visually start the search
    dispatch(startFetch(query, near, venueId));

    // Then begin to fetch the data
    return (
      fetchFS(fetchParams)
        // When the results arrive convert them to readebla json format
        .then(response => {
          return response.json();
        })

        .then(response => {
          // Check if there is any errors
          // see developer.foursquare.com/docs/api/troubleshooting/errors
          if (response.meta.code === 200) {
            // Check if there is any result..
            if (response.response.totalResults == 0) {
              // If no results, stop the search and inform the UI
              // that the results are empty.
              setTimeout(() => {
                dispatch(stopFetch());
                dispatch(beep(1, config.UI.messages.no_results_found_text));
              }, config.UI.delay);
            } else {
              // If there are results proceed with a little bit of delay
              setTimeout(() => {
                // There are small differences on both endpoint's logic
                if (endpoint == 'explore') {
                  dispatch(saveSearch(normalizeExplore(response)));
                  dispatch(saveStateToLocalstorage());
                  dispatch(goToSearchPage(response.meta.requestId));
                } else if (endpoint == 'photos' || endpoint == 'tips') {
                  // We're adding the venue id because on the response
                  // from the server there isn't any information about the venue
                  dispatch(
                    saveVenue(
                      normalizeVenue(response, venueId, offset),
                      venueId
                    )
                  );
                  dispatch(saveStateToLocalstorage());
                }

                // Stop the search
                dispatch(stopFetch());
              }, config.UI.delay);
            }
          } else {
            // If the server responds us with a satuts code othan than 200
            // proceed with error handling
            dispatch(stopFetch());
            dispatch(
              beep(
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
          setTimeout(() => {
            dispatch(stopFetch());
            dispatch(beep(3, error, config.UI.messages.error_title));
          }, config.UI.delay);
        })
    );
  };
};

/**
 * Go back to home
 */
export const goToHomePage = () => {
  return dispatch => {
    dispatch(push('/'));
  };
};

/**
 * Go to a specific search page
 * @param {string} id - Unique search id
 */
export const goToSearchPage = id => {
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
    dispatch(goToHomePage());
    dispatch(clearStore());
    clearStorage();
    dispatch(beep(0, config.UI.messages.cleared_all));
  };
};
