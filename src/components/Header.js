import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Logo from 'components/Logo';
import Search from 'components/Search';
import Welcome from 'components/Welcome';
import VenueHeader from 'components/VenueHeader';
import { clearfix, media } from 'utilities/style-mixins';
import imgBg from 'images/background';

/*
 * Header atoms
 */

const Header = styled.header`
  text-align: center;
  background-size: cover;
  background-image: url(${imgBg});
`;

const HeaderWrapper = styled.div`
  ${clearfix};
  width: 100%;
  max-width: 1020px;
  margin: 0 auto;
  padding: 0 30px 30px 30px;
  box-sizing: border-box;
`;

/*
 * Header container with routes attached to the inner components
 */
export default props => (
  <Header>
    <HeaderWrapper>
      <Route path="/:endpoint?/:id?" component={Logo} />
      <Route path="/" exact component={Welcome} />
      <Route path="/search/:id?" exact component={Search} />
      <Route path="/" exact component={Search} />
    </HeaderWrapper>
    <Route path="/venue/:id" component={VenueHeader} />
  </Header>
);
