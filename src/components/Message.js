import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Paragraph } from 'components/Atoms';
import { fadeOut, go } from 'utilities/style-mixins';
import { isUndefined, isNull } from 'utilities/helpers';

const MsgWrapper = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 0:
        return '#5680fd';
        break;
      case 1:
        return '#ef8d45';
        break;
      case 2:
        return '#ff5f5f';
        break;
      case 3:
        return '#de0266';
        break;
      default:
        return '#823060';
    }
  }};
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
`;

const MsgHeading = Heading.withComponent('h2').extend`
  font-size: 1.3125em;
  margin-bottom: 15px;
`;

const MsgText = Paragraph.extend`
  color: #fff;
  margin: 0;
  font-size: 1em;
`;

class Message extends React.Component {
  constructor() {
    super();
  }

  shouldRender() {
    return (
      !isUndefined(this.props.type) &&
      !isUndefined(this.props.text) &&
      !isNull(this.props.type) &&
      !isNull(this.props.text)
    );
  }

  /*shouldComponentUpdate() {
    return shouldRender();
  }*/

  render() {
    if (this.shouldRender()) {
      return (
        <MsgWrapper type={this.props.type}>
          {this.props.title && (
            <MsgHeading gotham="medium">{this.props.title}</MsgHeading>
          )}
          <MsgText gotham="book">{this.props.text}</MsgText>
        </MsgWrapper>
      );
    }

    return null;
  }
}

Message.propTypes = {
  type: PropTypes.number,
  title: PropTypes.string,
  text: PropTypes.string
};

export default Message;
