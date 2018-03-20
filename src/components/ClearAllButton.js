import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from 'components/Atoms';
import { clearAll } from 'utilities/actions';
import { media } from 'utilities/style-mixins';

const ClearAllButton = ({ onClick, className }) => (
  <Button className={className} onClick={onClick}>
    Clear All
  </Button>
);

const StyledClearAllButton = styled(ClearAllButton)`
  display: block;
  box-shadow: none;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #eee;
  color: #9b9b9b;
`;

ClearAllButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: e => {
      dispatch(clearAll());
    }
  };
};

export default connect(undefined, mapDispatchToProps)(StyledClearAllButton);
