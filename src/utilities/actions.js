import { push } from 'react-router-redux';
import { isUndefined } from 'utilities/helpers';
import { fetchFS, normalize } from 'utilities/foursquare';
import { saveStorage, clearStorage } from 'utilities/localstorage';
import { changeTitle, timeAgo, capitalize } from 'utilities/helpers';
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
 * Redux action to start the search (visually).
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @return {object} An object with action type and query and near keywords
 */
const startSearch = (query, near) => {
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
const stopSearch = () => {
  return { type: STOP_SEARCH };
};

/**
 * Action to update the search.
 * @param {string} query - the 'looking for' keyword from the DOM input
 * @param {string} near - the 'place' keyword from the DOM input
 * @param {string} searchId - the ID of the current search
 * @return {object} An object with just an action type
 */
const updateSearch = (query, near, searchId) => {
  return {
    type: UPDATE_SEARCH,
    query,
    near,
    id: searchId
  };
};

/**
 * Action to reset the current search.
 * @public
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
const beepSearch = (type, text, title = '') => {
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
const saveSearch = (query, near, normResp) => {
  return {
    type: SAVE_SEARCH,
    query,
    near,
    search: normResp.search,
    entities: normResp.entities
  };
};

/**
 * Action to check the store for saved searches and retrieve them
 * @public
 * @param  {string} searchId -
 * @return  {function}
 */
export const getSearch = searchId => {
  return (dispatch, getState) => {
    // Cache store
    const state = getState();
    const search = state.searches[searchId];

    // Check store and if there is match update the search entity
    if (state.searches[searchId]) {
      dispatch(updateSearch(search.query, search.near, search.id));
    } else {
      // If no match found go back to home and be ready for next search
      dispatch(goHome());
      dispatch(beepSearch(1, config.UI_messages.no_match_found_text));
    }
  };
};

/**
 * Action to save the 'searches' and 'entities' to localstorage
 * @return  {function}
 */
const saveStateToLocalstorage = () => {
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
 * @public
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
                  beepSearch(1, config.UI_messages.no_results_found_text)
                );
              }, config.UI_delay);
            } else {
              // Otherwise stop the search, save the results to the Redux store
              // and change the url to search/:id
              setTimeout(() => {
                dispatch(stopSearch());
                dispatch(saveSearch(query, near, normalize(response)));
                dispatch(saveStateToLocalstorage());
                dispatch(goSearch(response.meta.requestId, query, near));
              }, config.UI_delay);
            }
          } else {
            // If the server responds us with a satuts code othan than 200
            // proceed with error handling
            dispatch(stopSearch());
            dispatch(
              beepSearch(
                2,
                response.meta.errorDetail,
                config.UI_messages.api_response_title
              )
            );
          }
        })

        // If any errros happened during the process
        // stop the search and parse the errors
        .catch(error => {
          dispatch(stopSearch());
          dispatch(beepSearch(3, error, config.UI_messages.error_title));
        })
    );
  };
};

/**
 * Clears the current search and go back to home
 * @public
 */
export const goHome = () => {
  return dispatch => {
    changeTitle('Home');
    dispatch(push('/'));
    dispatch(clearSearch());
  };
};

/**
 * Go to a specific search page
 * @public
 */
export const goSearch = (id, query, near) => {
  return dispatch => {
    changeTitle(capitalize(query) + ' in ' + capitalize(near));
    dispatch(push('/search/' + id));
  };
};

/**
 * Clears Redux store
 * @return {object} An object with just an action type
 */
const clearStore = () => {
  return { type: CLEAR_ALL };
};

/**
 * Clears Redux store and localstorage, returns to home
 * and congratulates you for all you've done.
 * @public
 */
export const clearAll = () => {
  return dispatch => {
    dispatch(goHome());
    dispatch(clearStore());
    clearStorage();
    dispatch(beepSearch(0, config.UI_messages.cleared_all));
  };
};

/**
 * Maps the state for the UI of the results page
 * @param  {object} state - Current store's state
 * @param  {object} ownProps - Current properties supplied to the component
 * @return {object} Final properties which will be injected into the component
 */
export const mapStateToResults = (state, ownProps) => {
  // Check if any search matches the url parameter, if not pass an empty object
  if (isUndefined(state.searches[ownProps.match.params.id])) {
    return { venues: [], searches: [] };
  }

  return {
    // Get the venue list of the current search result
    venues: state.searches[ownProps.match.params.id].results.map(id => {
      const currentVenue = state.entities.venues[id];
      return {
        id: id,
        name: currentVenue.name,
        rating: currentVenue.rating,
        price: currentVenue.price,
        hereNow: currentVenue.hereNow,
        photo: currentVenue.photos.length
          ? currentVenue.photos.filter(photo => photo.type == 'venue').length
            ? currentVenue.photos.filter(photo => photo.type == 'venue')[0].url
            : currentVenue.photos[0].url
          : config.UI_placeholder_img
      };
    }),

    // Get all the previous searches for sidebar
    searches: Object.keys(state.searches).map(id => {
      return {
        id: id,
        title: state.searches[id].query + ' in ' + state.searches[id].near,
        timeAgo: timeAgo(state.searches[id].createdAt)
      };
    })
  };
};
