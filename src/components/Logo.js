import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { goToHomePage } from 'utilities/actions';
import { clearfix, media, isSearch } from 'utilities/style-mixins';
import { ScreenReaderText } from 'components/Atoms';
import iconLogo from 'images/logo';
import config from 'utilities/config';

// LogoWrapper is an <a> tag with <h1> and <img> inside
// The most complicated dynamic css of the project :(
const LogoWrapper = styled.a.attrs({
  href: '#/'
})`
  display: block;
  position: relative;
  border: 3px solid #fff;
  transform: translate(0, -50%) rotate(45deg);
  width: 80%;
  max-width: 300px;
  max-height: 300px;
  transform-origin: 50% 50%;
  margin: 0 auto -30px auto;
  box-sizing: border-box;
  transition: background-color 200ms, transform 300ms;
  ${props =>
    isSearch`${props}
    max-width: 180px;
    max-height: 180px;
  `}
  ${media.tablet`
    margin-bottom:-50px
  `} 
  ${media.laptop`  
    ${props =>
      isSearch`${props}
      float:left;
    `}
  `}
   &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translate(0,-51%) rotate(45deg);
  }
  > img {
    position: absolute;
    bottom: 20px;
    right: 20px;
    transition: bottom 200ms ease-out, right 200ms ease-out, transform 300ms;
    transform: rotate(-45deg);
    transform-origin: 50% 50%;
    ${media.tablet`
      bottom: 50px;
      right: 50px;
      ${props =>
        isSearch`${props}
        bottom:20px;
        right:20px;
      `}
    `};
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
    this.setLogoHeight = this.setLogoHeight.bind(this);
  }

  is404() {
    return !(
      this.props.location.pathname == '/' ||
      this.props.match.params.endpoint == config.app.endpoints.search ||
      this.props.match.params.endpoint == config.app.endpoints.venue
    );
  }

  // Make the logo's height same with its width
  setLogoHeight() {
    const { LogoWrapper } = this.elements;
    LogoWrapper.style.height = LogoWrapper.offsetWidth + 'px';
  }

  addListener() {
    setTimeout(this.setLogoHeight, 0);
    window.addEventListener('resize', this.setLogoHeight);
  }

  componentDidMount() {
    this.addListener();
  }

  componentWillUpdate() {
    this.addListener();
  }

  render() {
    return this.is404() ? (
      <Redirect to="/" />
    ) : (
      <LogoWrapper
        pathname={this.props.location.pathname}
        onClick={this.props.onClick}
        innerRef={tag => {
          this.elements.LogoWrapper = tag;
        }}
      >
        <img src={iconLogo} alt={config.app.title} />
        <LogoText>{config.app.title}</LogoText>
      </LogoWrapper>
    );
  }
};

Logo.propTypes = {
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: e => {
      e.preventDefault();
      dispatch(goToHomePage());
    }
  };
};

export default connect(undefined, mapDispatchToProps)(Logo);
