import React from 'react';
import styled from 'styled-components';
import { Link } from 'components/Atoms';
import { media } from 'utilities/style-mixins';

// Footer links array to map
const navItems = [
  { name: 'About us', href: '#/' },
  { name: 'Contact', href: '#/' },
  { name: 'Blog', href: '#/' }
];

/*
 * Footer atoms
 */

const LinkFooter = Link.extend`
  font-size: 0.75em;
  padding: 10px;
  color: #9b9b9b;
  display: block;
  ${media.tablet`
    display:inline-block
  `};
`;

const Nav = styled.nav`
  ${media.laptop`
    border-top: ${props => (!props.border ? '2px solid #e3e3e3' : 'none')};
    padding-top: ${props => (!props.border ? '40px' : '0')};
  `};
  max-width: 1040px;
  margin: 0 auto;
`;

const Footer = styled.footer`
  text-align: center;
  padding: 40px;
`;

/*
 * Footer component
 */
export default props => {
  return (
    <Footer>
      <Nav border={props.match.url == '/'}>
        {navItems.map((item, i) => (
          <LinkFooter gotham="medium" href={item.href} key={i}>
            {item.name}
          </LinkFooter>
        ))}
      </Nav>
    </Footer>
  );
};
