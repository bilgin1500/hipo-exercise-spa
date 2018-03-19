import React from 'react';
import styled from 'styled-components';
import { Heading, Paragraph } from 'components/Atoms';
import Logo from 'components/Logo';
import Search from 'components/Search';
import media from 'utilities/mediaqueries';
import imgBg from 'images/background';

const Header = styled.header`
  text-align: center;
  background-size: cover;
  background-image: url(${imgBg});
  padding: 0 30px 30px 30px;
`;

const InnerWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const HeadingWelcome = Heading.withComponent('h2').extend`
  margin:0 0 15px 0;
  font-size:2.5em;
  ${media.laptop`font-size:3.5em;`};
`;

const ParagraphWelcome = Paragraph.extend`
  margin: 0 0 30px 0;
  > br {
    display: none;
  }
  ${media.laptop`
    > br {
      display:block;
    }
  `};
  ${media.desktop`
    margin-bottom:50px;
  `};
`;

export default () => (
  <Header>
    <Logo />
    <InnerWrapper>
      <HeadingWelcome>Lorem ipsum dolor sit!</HeadingWelcome>
      <ParagraphWelcome>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br /> sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </ParagraphWelcome>
      <Search />
    </InnerWrapper>
  </Header>
);
