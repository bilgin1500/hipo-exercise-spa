import React from 'react';
import styled from 'styled-components';

const Footer = ({ className }) => (
  <footer className={className}>
    <p>This is the footer</p>
  </footer>
);

const StyledFooter = styled(Footer)`
  font-family: 'Gotham Book';
  color: black;
  font-weight: bold;
`;

export default StyledFooter;
