import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Input, Button, Loader } from 'components/Atoms';
import { getSearch, fetchFoursquare, clearSearch } from 'utilities/actions';
import { isUndefined } from 'utilities/helpers';
import Message from 'components/Message';
import { media } from 'utilities/style-mixins';
import iconMagnifier from 'images/magnifier';

/*
  Below are the dumb components we're going to use in the search panel.
  All the components are extended from the atoms we defined in components/atoms.js
 */

const InputQuery = Input.extend`
  border: ${props => (props.valid ? 'none' : '3px solid red')};
  ${media.laptop`max-width: 290px;`};
`;

const InputPlace = Input.extend`
  border: ${props => (props.valid ? 'none' : '3px solid red')};
  ${media.laptop`max-width: 160px;`};
`;

const SearchLoader = Loader.extend`
  margin-top: 15px;
`;

/**
 * The smart search component which submits the search query to the Foursquare
 * API and dispatches the 'fetchFoursquare' action afterwards.
 */
class Search extends React.Component {
  constructor() {
    super();
    this.state = { isValidated: true };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputs() {
    const query = this.props.query;
    const near = this.props.near;

    this.InputQuery.value = query || '';
    this.InputPlace.value = near || '';

    if (isUndefined(query) || near == '') {
      this.InputQuery.focus();
    } else {
      this.InputQuery.blur();
      this.InputPlace.blur();
    }
  }

  handleSearch() {
    // Check if a previous made search is requested from the parameters
    var searchId = this.props.match.params.id;

    if (!isUndefined(searchId)) {
      this.props.dispatch(getSearch(searchId));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = this.InputQuery.value;
    const place = this.InputPlace.value;

    // The most basic form validation
    if (query && place) {
      this.setState({ isValidated: true });
      this.props.dispatch(fetchFoursquare(query, place));
    } else {
      this.setState({ isValidated: false });
    }
  }

  componentDidMount() {
    this.handleSearch();
    this.handleInputs();
  }

  componentDidUpdate() {
    this.handleSearch();
    this.handleInputs();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <InputQuery
          placeholder="I’m looking for"
          innerRef={tag => (this.InputQuery = tag)}
          defaultValue={this.props.query}
          valid={this.state.isValidated}
        />
        <InputPlace
          placeholder="Place"
          innerRef={tag => (this.InputPlace = tag)}
          defaultValue={this.props.near}
          valid={this.state.isValidated}
        />
        <Button onClick={this.handleSubmit} disabled={this.props.isFetching}>
          <img src={iconMagnifier} />
        </Button>

        {this.props.isFetching && <SearchLoader color="#ff5f5f" />}

        <Message {...this.props.message} />
      </form>
    );
  }
}

Search.propTypes = {
  id: PropTypes.string,
  query: PropTypes.string,
  near: PropTypes.string,
  isFetching: PropTypes.bool,
  message: PropTypes.shape({
    type: PropTypes.number,
    title: PropTypes.string,
    text: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired
};

export default withRouter(
  connect(({ currentSearch }) => ({ ...currentSearch }))(Search)
);
