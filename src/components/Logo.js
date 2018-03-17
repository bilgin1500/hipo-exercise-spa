import React from 'react';
import styled from 'styled-components';
import media from 'utilities/mediaqueries';
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
 * Logo component
 *
 * This component wraps the logo image and type. Via its
 * setLogoWrapperWidth method it listens to window resize events and helps the
 * LogoWrapper to get its new height according to percentage width
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
      >
        <img src={iconLogo} alt="Foursquared" />
        <LogoText>Foursquared</LogoText>
      </LogoWrapper>
    );
  }
};

export default Logo;
