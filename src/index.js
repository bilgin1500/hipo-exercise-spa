import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import history from 'utilities/history';
import store from 'utilities/store';
import ClearAllButton from 'components/ClearAllButton';
import PageLoader from 'components/PageLoader';
import Header from 'components/Header';
import Results from 'components/Results';
import Footer from 'components/Footer';
import 'images/favicon-16x16';
import 'images/favicon-32x32';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <ClearAllButton />
        <Route path="/:endpoint?/:id?" component={Header} />
        <Route path="/search/:id" exact component={Results} />
        <Footer />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
