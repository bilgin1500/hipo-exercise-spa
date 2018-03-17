import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Header from 'components/Header';
import Footer from 'components/Footer';
import 'images/favicon-16x16';
import 'images/favicon-32x32';
import iconLogo from 'images/logo';
import {
  GothamExtraLight,
  GothamBook,
  GothamMedium
} from 'utilities/fontfaces';

// A basic loader component to hide the content
// while fonts are loading
const Loader = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 100;
`;

/**
 * App component
 *
 * This component is responsible to wrap all the app's content and do the font
 * loading
 */
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };

    // With Promise.all fire events after all fonts are loaded
    Promise.all([
      GothamExtraLight.load(),
      GothamBook.load(),
      GothamMedium.load()
    ]).then(
      () => {
        this.setState({ isLoading: false });
      },
      err => {
        console.error('Failed to load fonts!', err);
        this.setState({ isLoading: false });
      }
    );
  }

  render() {
    return this.state.isLoading ? (
      <main>
        <Loader />
      </main>
    ) : (
      <main>{this.props.children}</main>
    );
  }
}

ReactDOM.render(
  <App>
    <Header />
    <Footer />
  </App>,
  document.getElementById('app')
);
