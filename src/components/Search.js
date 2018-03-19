import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fetchFoursquare } from 'utilities/actions';
import { Input, Button, Heading, Paragraph } from 'components/Atoms';
import media from 'utilities/mediaqueries';
import iconMagnifier from 'images/magnifier';

const InputQuery = Input.extend`
  ${media.laptop`max-width: 290px;`};
`;

const InputPlace = Input.extend`
  ${media.laptop`max-width: 160px;`};
`;

const ErrorWrapper = styled.div`
  background-color: red;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
`;

const ErrorHeading = Heading.withComponent('h2').extend`
  font-size:1.3125em;
  margin-top:0;
  margin-bottom:15px;
`;

const ErrorText = Paragraph.extend`
  color: #fff;
  margin: 0;
  font-size: 0.8125em;
`;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = this.InputQuery.value;
    const place = this.InputPlace.value;
    this.props.dispatch(fetchFoursquare(query, place));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <InputQuery
          placeholder="I’m looking for"
          innerRef={tag => (this.InputQuery = tag)}
          defaultValue={this.props.query}
        />
        <InputPlace
          placeholder="Place"
          innerRef={tag => (this.InputPlace = tag)}
          defaultValue={this.props.near}
        />
        <Button onClick={this.handleSubmit} disabled={this.props.isFetching}>
          <img src={iconMagnifier} />
        </Button>

        {this.props.isError && (
          <ErrorWrapper>
            <ErrorHeading>Ooops! Something bad happened.</ErrorHeading>
            <ErrorText>{this.props.errorMsg}</ErrorText>
          </ErrorWrapper>
        )}
      </form>
    );
  }
}

Search.propTypes = {
  query: PropTypes.string.isRequired,
  near: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isError: PropTypes.bool,
  errorMsg: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { query, near, isFetching, isError, errorMsg } = state.currentSearch;
  return {
    query,
    near,
    isFetching,
    isError,
    errorMsg
  };
}
export default connect(mapStateToProps)(Search);
