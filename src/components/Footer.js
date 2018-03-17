import React from 'react';
import styled from 'styled-components';
import { Link } from 'components/Atoms';

const navItems = [
  { name: 'About us', href: '#' },
  { name: 'Contact', href: '#' },
  { name: 'Blog', href: '#' }
];

const LinkFooter = Link.extend`
  font-size: 0.75em;
  padding: 10px;
  color: #9b9b9b;
`;

const Nav = ({ className }) => (
  <nav>
    {navItems.map((item, i) => (
      <LinkFooter className={className} href={item.href} key={i}>
        {item.name}
      </LinkFooter>
    ))}
  </nav>
);

const Footer = styled.footer`
  text-align: center;
  padding: 40px;
`;

export default () => (
  <Footer>
    <Nav />
  </Footer>
);
