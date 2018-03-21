import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Logo from 'components/Logo';
import Search from 'components/Search';
import Welcome from 'components/HeaderWelcome';
import { clearfix, media } from 'utilities/style-mixins';
import imgBg from 'images/background';

const Header = styled.header`
  text-align: center;
  background-size: cover;
  background-image: url(${imgBg});
  padding: 0 30px 30px 30px;
`;

const HeaderWrapper = styled.div`
  ${clearfix};
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
`;

export default props => (
  <Header>
    <HeaderWrapper>
      <Route path="/:endpoint?/:id?" component={Logo} />
      <Route path="/" exact component={Welcome} />
      <Route path="/:endpoint?/:id?" component={Search} />
    </HeaderWrapper>
  </Header>
);
