import React from 'react';
import styled from 'styled-components';
import { Heading, Paragraph } from 'components/Atoms';
import { media } from 'utilities/style-mixins';

/*
 * Welcome text atoms
 */

const WelcomeWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  ${media.laptop`
    margin: 0 auto 65px auto;
  `};
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

// The welcome component
export default () => (
  <WelcomeWrapper>
    <HeadingWelcome>Lorem ipsum dolor sit!</HeadingWelcome>
    <ParagraphWelcome gotham="book">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br /> sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </ParagraphWelcome>
  </WelcomeWrapper>
);
