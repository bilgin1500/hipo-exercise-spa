import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { fetchFoursquare } from 'utilities/actions';
import { Input, Button, Heading, Paragraph, Loader } from 'components/Atoms';
import media from 'utilities/mediaqueries';
import iconMagnifier from 'images/magnifier';

const InputQuery = Input.extend`
  ${media.laptop`max-width: 290px;`};
`;

const InputPlace = Input.extend`
  ${media.laptop`max-width: 160px;`};
`;

const MsgWrapper = styled.div`
  background-color: ${props => (props.error ? 'red' : '#fe5e5e')};
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

const SearchLoader = Loader.extend`
  margin-top: 15px;
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

    // The most basic form validtion
    if (query && place) this.props.dispatch(fetchFoursquare(query, place));
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

        {this.props.isFetching ? (
          <SearchLoader color="#ff5f5f" />
        ) : (
          (this.props.isError || this.props.isEmpty) && (
            <MsgWrapper error={this.props.isError}>
              {this.props.isError && (
                <MsgHeading>Ooops! Something bad happened.</MsgHeading>
              )}
              <MsgText>
                {this.props.isEmpty ? 'Sorry no results' : this.props.errorMsg}
              </MsgText>
            </MsgWrapper>
          )
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
  isEmpty: PropTypes.bool,
  errorMsg: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const {
    query,
    near,
    isFetching,
    isError,
    isEmpty,
    errorMsg
  } = state.currentSearch;

  return {
    query,
    near,
    isFetching,
    isError,
    isEmpty,
    errorMsg
  };
}
export default connect(mapStateToProps)(Search);
