import merge from 'lodash.merge';
import { combineReducers } from 'redux';
import {
  START_SEARCH,
  STOP_SEARCH,
  ERROR_SEARCH,
  ADD_SEARCH
} from 'utilities/actions';

const currentSearch = (
  state = { isFetching: false, isError: false },
  action
) => {
  switch (action.type) {
    case START_SEARCH:
      return Object.assign({}, state, {
        query: action.query,
        near: action.near,
        isFetching: true
      });
    case STOP_SEARCH:
      return Object.assign({}, state, {
        isFetching: false
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

const searches = (state = [], action) => {
  switch (action.type) {
    case ADD_SEARCH:
      return [
        ...state,
        {
          id: action.search.id,
          query: action.search.query,
          near: action.search.near,
          results: action.search.results
        }
      ];
    default:
      return state;
  }
};

const entities = (
  state = { users: [], categories: [], venues: [] },
  action
) => {
  if (action.entities) {
    return merge({}, state, action.entities);
  }
  return state;
};

const rootReducer = combineReducers({
  currentSearch,
  searches,
  entities
});

export default rootReducer;
