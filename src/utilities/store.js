import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import preloadedState from 'utilities/state';
import rootReducer from 'utilities/reducers';

// Redux devtool extension setup
// @see https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
