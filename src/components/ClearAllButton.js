import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from 'components/Atoms';
import { clearAll } from 'utilities/actions';

const ClearAllButton = ({ onClick, className }) => (
  <Button className={className} onClick={onClick}>
    Clear All
  </Button>
);

const StyledClearAllButton = styled(ClearAllButton)`
  position: fixed;
  top: 20px;
  right 20px;
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
