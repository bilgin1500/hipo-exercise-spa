import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import history from 'utilities/history';
import store from 'utilities/store';
import { globalCss } from 'utilities/style-global';
import PageLoader from 'components/PageLoader';
import Header from 'components/Header';
import Results from 'components/Results';
import VenueDetail from 'components/VenueDetail';
import Footer from 'components/Footer';
import 'images/favicon-16x16';
import 'images/favicon-32x32';

globalCss();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route path="/:endpoint?/:id?" component={Header} />
        <Route path="/search/:id" exact component={Results} />
        <Route path="/venue/:id" exact component={VenueDetail} />
        <Route path="*" component={Footer} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
