import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { mapStateToHeaderSearch } from 'utilities/state-mapper';
import { Input, Button, Loader } from 'components/Atoms';
import { fetchFoursquare } from 'utilities/actions';
import { isUndefined, checkList } from 'utilities/helpers';
import Message from 'components/Message';
import { clearfix, media, isSearch } from 'utilities/style-mixins';
import iconMagnifier from 'images/magnifier';
import config from 'utilities/config';

/*
  Below are the dumb components we're going to use in the search panel.
  All the components are extended from the atoms we defined in components/atoms.js
 */

const Form = styled.form`
  margin: 0 auto;
  max-width: 600px;
  ${props =>
    isSearch`${props}
      margin-top: 20px;
    `};
  ${media.laptop`
    margin: 0 auto 135px auto;
    ${props =>
      isSearch`${props}
      float: right;
      text-align: center;
      margin:0;
      margin-top: 50px;
      margin-right: 50px;
      width: calc(100% - 250px);
    `};
  `};
`;

const SearchInput = Input.extend`
  box-shadow: ${props =>
    props.valid
      ? '0 12px 21px 0 rgba(0,0,0,0.25)'
      : '0 0 21px 0 rgba(255, 95, 95, 0.85)'};
  margin-bottom: 10px;
  ${media.tablet`
    width: 40%;
    margin-right: 2%;
    margin-bottom:0;
  `};
`;

const Submit = Button.extend`
  ${media.tablet`width: 16%;`};
  transition: background-color 250ms;
  &:hover {
    background-color: #e24848;
  }
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
    const query = this.props.currentFetch.query;
    const near = this.props.currentFetch.near;

    this.InputQuery.value = query || '';
    this.InputNear.value = near || '';

    if (isUndefined(query) || near == '') {
      this.InputQuery.focus();
    } else {
      this.InputQuery.blur();
      this.InputNear.blur();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = this.InputQuery.value;
    const near = this.InputNear.value;

    // The most basic form validation
    if (query && near) {
      this.setState({ isValidated: true });
      this.props.dispatch(
        fetchFoursquare({
          endpoint: 'explore',
          query,
          near
        })
      );
    } else {
      this.setState({ isValidated: false });
    }
  }

  componentDidMount() {
    this.handleInputs();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentFetch.near && newProps.currentFetch.query) {
      this.setState({ isValidated: true });
    }
  }

  componentDidUpdate() {
    this.handleInputs();
  }

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        pathname={this.props.location.pathname}
      >
        <SearchInput
          placeholder="I’m looking for"
          innerRef={tag => (this.InputQuery = tag)}
          defaultValue={this.props.currentFetch.query}
          valid={this.state.isValidated}
        />
        <SearchInput
          placeholder="Place"
          innerRef={tag => (this.InputNear = tag)}
          defaultValue={this.props.currentFetch.near}
          valid={this.state.isValidated}
        />
        <Submit
          onClick={this.handleSubmit}
          disabled={this.props.currentFetch.isFetching}
        >
          <img src={iconMagnifier} />
        </Submit>

        {this.props.currentFetch.isFetching &&
          this.props.match.url == '/' && <SearchLoader color="#ff5f5f" />}

        <Message message={this.props.currentFetch.message} />
      </Form>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentFetch: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    query: PropTypes.string,
    near: PropTypes.string,
    message: PropTypes.shape({
      type: PropTypes.number,
      title: PropTypes.string,
      text: PropTypes.string
    })
  })
};

export default withRouter(connect(mapStateToHeaderSearch)(Search));
