import React from 'react';
import styled from 'styled-components';

const Header = ({ className }) => (
  <header className={className}>
    <h1 className={className}>This is header</h1>
  </header>
);

const StyledHeader = styled(Header)`
  color: red;
  font-family: 'Gotham Extra Light', Helvetica Neue, Helvetica, Arial,
    sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  font-weight: normal;
`;

export default StyledHeader;
