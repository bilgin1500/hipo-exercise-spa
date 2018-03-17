import React from 'react';
import styled from 'styled-components';
import { Heading, Paragraph, Input, Button } from 'components/Atoms';
import Logo from 'components/Logo';
import media from 'utilities/mediaqueries';
import imgBg from 'images/background';
import iconMagnifier from 'images/magnifier';

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

const InputKeyword = Input.extend`
  ${media.laptop`max-width: 290px;`};
`;

const InputPlace = Input.extend`
  ${media.laptop`max-width: 160px;`};
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
      <InputKeyword placeholder="I’m looking for" />
      <InputPlace placeholder="Place" />
      <Button>
        <img src={iconMagnifier} />
      </Button>
    </InnerWrapper>
  </Header>
);
