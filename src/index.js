import React from 'react';
import ReactDOM from 'react-dom';
// Components
import Header from 'components/Header';
import Footer from 'components/Footer';
// Styles, fonts and images
import 'normalize.css';
import styled from 'styled-components';
import 'images/favicon-16x16.png';
import 'images/favicon-32x32.png';
import { GothamBook, GothamExtraLight } from 'utilities/fontFaces';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };

    Promise.all([GothamExtraLight.load(), GothamBook.load()]).then(
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
    const { children, className } = this.props;
    const { isLoading } = this.state;

    return isLoading ? (
      <section className={className}>Loading...{children}</section>
    ) : (
      <section className={className}>{children}</section>
    );
  }
}

const StyledApp = styled(App)`
  padding: 4em;
  background: papayawhip;
`;

ReactDOM.render(
  <StyledApp>
    <Header />
    <Footer />
  </StyledApp>,
  document.getElementById('app')
);
