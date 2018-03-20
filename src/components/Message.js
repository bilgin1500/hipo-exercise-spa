import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Paragraph } from 'components/Atoms';
import { isUndefined, isNull } from 'utilities/helpers';

const MsgWrapper = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 0:
        return 'green';
        break;
      case 1:
        return 'orange';
        break;
      case 2:
        return '#ff5f5f';
        break;
      case 3:
        return 'red';
        break;
      default:
        return '#444';
    }
  }};
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
`;

const MsgHeading = Heading.withComponent('h2').extend`
  font-size:1.3125em;
  margin-top:0;
  margin-bottom:15px;
`;

const MsgText = Paragraph.extend`
  color: #fff;
  margin: 0;
  font-size: 0.8125em;
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
          {this.props.title && <MsgHeading>{this.props.title}</MsgHeading>}
          <MsgText>{this.props.text}</MsgText>
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
