import merge from 'lodash.merge';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { convertDate } from 'utilities/helpers';
import {
  START_SEARCH,
  STOP_SEARCH,
  UPDATE_SEARCH,
  CLEAR_SEARCH,
  BEEP_SEARCH,
  SAVE_SEARCH,
  CLEAR_ALL
} from 'utilities/actions';

/*
  Our reducers are designed according to the Redux practice of reducer splitting.
  For more details please visit: redux.js.org/basics/reducers#splitting-reducers
  ! The names of the reducers are the same with the corresponding store entitity
 */

/**
 * Handles the header page search logic. It starts and stops the search and
 * throw the error/message box when needed.
 * @param  {Object} state - Previous state ('currentSearch' entitiy is an array)
 * @param  {Object} action - Changes to the prev. state
 * @return {Object} Next state
 */
const currentSearch = (state = {}, action) => {
  switch (action.type) {
    case START_SEARCH:
      return Object.assign({}, state, {
        query: action.query,
        near: action.near,
        isFetching: true,
        message: {
          type: null,
          title: '',
          text: ''
        }
      });

    case STOP_SEARCH:
      return Object.assign({}, state, {
        isFetching: false,
        message: {
          type: null,
          title: '',
          text: ''
        }
      });

    case UPDATE_SEARCH:
      return Object.assign({}, state, {
        query: action.query,
        near: action.near,
        id: action.id,
        isFetching: true
      });

    case CLEAR_SEARCH:
      return Object.assign({}, state, {
        query: '',
        near: '',
        id: null,
        isFetching: false
      });

    case SAVE_SEARCH:
      return Object.assign({}, state, {
        id: action.search.id
      });

    case BEEP_SEARCH:
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
 * @param  {Object} state - Previous state. ('searches' entitiy is an array)
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
 * Foursquare entitites in a normalized shape)
 * @param  {Object} action - Changes to the prev. state
 * @return {Object} Next state
 */
const entities = (
  state = { users: {}, categories: {}, venues: {} },
  action
) => {
  if (action.entities) {
    return merge({}, state, action.entities);
  }
  return state;
};

// https://redux.js.org/api-reference/combinereducers
const appReducer = combineReducers({
  currentSearch,
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
