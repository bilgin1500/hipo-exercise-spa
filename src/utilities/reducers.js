import merge from 'lodash.merge';
import { combineReducers } from 'redux';
import { convertDate } from 'utilities/helpers';
import {
  START_SEARCH,
  STOP_SEARCH,
  ERROR_SEARCH,
  ADD_SEARCH
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
        isError: false,
        isEmpty: false
      });

    case STOP_SEARCH:
      return Object.assign({}, state, {
        isFetching: false,
        isEmpty: action.isEmpty
      });

    case ERROR_SEARCH:
      return Object.assign({}, state, {
        isError: true,
        errorMsg: action.errorMsg
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
const searches = (state = [], action) => {
  switch (action.type) {
    case ADD_SEARCH:
      return [
        ...state,
        {
          id: action.search.id,
          query: action.search.query,
          near: action.search.near,
          results: action.search.results,
          createdAt: convertDate(new Date())
        }
      ];

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
  state = { users: [], categories: [], venues: [] },
  action
) => {
  if (action.entities) {
    return merge({}, state, action.entities);
  }
  return state;
};

// https://redux.js.org/api-reference/combinereducers
const rootReducer = combineReducers({
  currentSearch,
  searches,
  entities
});

export default rootReducer;
