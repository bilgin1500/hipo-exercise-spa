import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Paragraph } from 'components/Atoms';
import { fadeOut, go } from 'utilities/style-mixins';
import { isUndefined, isNull, isEmptyObj } from 'utilities/helpers';

/*
 * Message atoms
 */

const MsgWrapper = styled.div`
  background-color: ${props => {
    // Background colors according to the type of the message
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

/*
 * Message component
 */
class Message extends React.Component {
  render() {
    // Render logic
    if (!isUndefined(this.props.message) && !isEmptyObj(this.props.message)) {
      return (
        <MsgWrapper type={this.props.message.type}>
          {this.props.message.title && (
            <MsgHeading gotham="medium">{this.props.message.title}</MsgHeading>
          )}
          <MsgText gotham="book">{this.props.message.text}</MsgText>
        </MsgWrapper>
      );
    }

    return null;
  }
}

// The message object
Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.number,
    title: PropTypes.string,
    text: PropTypes.string
  })
};

export default Message;
