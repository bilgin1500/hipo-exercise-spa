import mergeWith from 'lodash.mergewith';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { uniqueConcat } from 'utilities/helpers';
import {
  START_FETCH,
  STOP_FETCH,
  UPDATE_FETCH,
  SAVE_SEARCH,
  SAVE_VENUE,
  CLEAR_FETCH,
  CLEAR_ALL,
  BEEP
} from 'utilities/actions';

/*
  Our reducers are designed according to the Redux practice of reducer splitting.
  For more details please visit: redux.js.org/basics/reducers#splitting-reducers
  ! The names of the reducers are the same with the corresponding store entitity
 */

/**
 * Handles all the fetching<->store relationship.
 * @param  {Object} state - Previous, current state
 * @param  {Object} action - Changes to the state through actions
 * @return {Object} Next state
 */
const currentFetch = (state = { isFetching: false }, action) => {
  switch (action.type) {
    case START_FETCH:
      return Object.assign({}, state, {
        query: action.query,
        near: action.near,
        venueId: action.venueId,
        isFetching: true,
        message: {}
      });

    case STOP_FETCH:
      return Object.assign({}, state, {
        isFetching: false,
        message: {}
      });

    case UPDATE_FETCH:
      return Object.assign({}, state, {
        query: action.query,
        near: action.near,
        searchId: action.searchId,
        venueId: action.venueId,
        isFetching: true
      });

    case CLEAR_FETCH:
      return Object.assign({}, state, {
        query: '',
        near: '',
        searchId: '',
        venueId: '',
        isFetching: false
      });

    case SAVE_SEARCH:
      return Object.assign({}, state, {
        searchId: action.search.id
      });

    case SAVE_VENUE:
      return Object.assign({}, state, {
        venueId: action.venueId
      });

    case BEEP:
      return Object.assign({}, state, {
        message: {
          type: action.msgType,
          title: action.msgTitle,
          text: action.msgText
        }
      });

    default:
      return state;
  }
};

/**
 * Handles the searches we've done so far. This reducer always saves a new
 * search to the store.
 * @param  {Object} state - Previous state.
 * @param  {Object} action - Changes to the prev. state
 * @return {Object} Next state
 */
const searches = (state = {}, action) => {
  switch (action.type) {
    case SAVE_SEARCH:
      return Object.assign(
        {},
        {
          [action.search.id]: {
            id: action.search.id,
            query: action.search.query,
            near: action.search.near,
            location: action.search.location,
            results: action.search.results,
            createdAt: new Date()
          },
          ...state
        }
      );

    default:
      return state;
  }
};

/**
 * Handles updating the entities.
 * @param  {Object} state - Previous state. ('entities' consists of all the
 * Foursquare entitites in a normalized structure)
 * @param  {Object} action - Changes to the prev. state
 * @return {Object} Next state
 */
const entities = (
  state = { users: {}, categories: {}, venues: {} },
  action
) => {
  if (action.entities) {
    return mergeWith({}, state, action.entities, uniqueConcat);
  }

  return state;
};

// https://redux.js.org/api-reference/combinereducers
const appReducer = combineReducers({
  currentFetch,
  searches,
  entities,
  router: routerReducer
});

/**
 * To clear the store we'll wrap the appReducer and handle
 * the 'reset' action here.
 */
const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_ALL') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
