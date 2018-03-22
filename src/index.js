import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import history from 'utilities/history';
import store from 'utilities/store';
import { checkUrlParams } from 'utilities/actions';
import { globalCss } from 'utilities/style-global';
import DocumentTitle from 'react-document-title';
import Header from 'components/Header';
import MainResults from 'components/MainResults';
import MainVenueDetail from 'components/MainVenueDetail';
import Footer from 'components/Footer';
import { ScrollToTop } from 'components/Atoms';
import config from 'utilities/config';
import 'images/favicon-16x16';
import 'images/favicon-32x32';

globalCss();

ReactDOM.render(
  <Provider store={store}>
    <DocumentTitle title={config.app.title}>
      <ConnectedRouter history={history}>
        <ScrollToTop>
          <Route path="/:endpoint?/:id?" component={Header} />
          <Route
            path={`/${config.app.endpoints.search}/:id?`}
            exact
            component={MainResults}
          />
          <Route
            path={`/${config.app.endpoints.venue}/:id?`}
            exact
            component={MainVenueDetail}
          />
          <Route component={Footer} />
        </ScrollToTop>
      </ConnectedRouter>
    </DocumentTitle>
  </Provider>,
  document.getElementById('app')
);
