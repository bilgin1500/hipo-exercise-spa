import React from 'react';
import styled from 'styled-components';
import { push } from 'react-router-redux';
import store from 'utilities/store';
import { clearSearch } from 'utilities/actions';
import media from 'utilities/mediaqueries';
import config from 'utilities/config';
import { ScreenReaderText } from 'components/Atoms';
import iconLogo from 'images/logo';

// LogoWrapper is an <a> tag with <h1> and <img> inside
const LogoWrapper = styled.a.attrs({
  href: '#'
})`
  display: block;
  position: relative;
  border: 3px solid #fff;
  transform: translate(0,-50%) rotate(45deg);
  width: 80%;
  max-width: 300px;
  max-height: 300px;
  transform-origin: 50% 50%;
  margin: 0 auto -30px auto;
  box-sizing: border-box;
  ${media.tablet`
    margin-bottom:-50px
  `}
  > img {
    position: absolute;
    bottom: 20px;
    right: 20px;
    transform: rotate(-45deg);
    transform-origin: 50% 50%;
    ${media.tablet`
      bottom: 50px;
      right: 50px;
    `}
    ${media.laptop`
      bottom: 80px;
      right: 80px;
    `}
  }
}
`;

// Extend ScreenReaderText with h1 tag so that it will be invisible
// for normal browsers but will be visible for screen readers.
const LogoText = ScreenReaderText.withComponent('h1');

/**
 * Logo component wraps the logo image and text. It also listens to the window
 * resize events and adjusts its height according to its percentage-based
 * width.
 */
const Logo = class App extends React.Component {
  constructor() {
    super();
    this.elements = {};
    this.setLogoWrapperWidth = this.setLogoWrapperWidth.bind(this);
  }

  setLogoWrapperWidth() {
    const { LogoWrapper } = this.elements;
    LogoWrapper.style.height = LogoWrapper.offsetWidth + 'px';
  }

  componentDidMount() {
    this.setLogoWrapperWidth();
    window.addEventListener('resize', this.setLogoWrapperWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setLogoWrapperWidth);
  }

  render() {
    return (
      <LogoWrapper
        innerRef={tag => {
          this.elements.LogoWrapper = tag;
        }}
        onClick={e => {
          store.dispatch(clearSearch());
          store.dispatch(push('/'));
        }}
      >
        <img src={iconLogo} alt={config.title} />
        <LogoText>{config.title}</LogoText>
      </LogoWrapper>
    );
  }
};

export default Logo;
