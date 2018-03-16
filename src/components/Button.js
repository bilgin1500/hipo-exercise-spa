import React from 'react';

const StyledButton = styled.button`
  background: blue;
  color: ${props => props.color};
`;

const Button = ({ onClick, children, color }) => (
  <StyledButton color={color} onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
