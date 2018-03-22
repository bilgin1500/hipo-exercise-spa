import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import history from 'utilities/history';
import { loadStorage } from 'utilities/localstorage';
import rootReducer from 'utilities/reducers';

// Redux devtool extension setup
// @see https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Build the middleware for intercepting and dispatching navigation actions
const routerMiddlewareWithHistory = routerMiddleware(history);

// Get user's local state from the browser's localstorage API
const localStorageState = loadStorage();

const store = createStore(
  rootReducer,
  localStorageState,
  composeEnhancers(
    applyMiddleware(thunkMiddleware, routerMiddlewareWithHistory)
  )
);

export default store;
