import React from 'react';
import styled from 'styled-components';
import {
  GothamExtraLight,
  GothamBook,
  GothamMedium
} from 'utilities/style-global';

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
 * PageLoader component
 *
 * This component is responsible to wrap all the app's content and do the font
 * loading
 */
export default class PageLoader extends React.Component {
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
    return !this.state.isLoading && <Loader />;
  }
}
