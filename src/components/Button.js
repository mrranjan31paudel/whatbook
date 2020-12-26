import React from 'react';
import PropTypes from 'prop-types';

import './../styles/common/button.css';

const Button = (props) => {
  const { className, type, isDisabled, value } = props;

  return (
    <button
      className={'submit-button' + className}
      type={type}
      disabled={isDisabled}
    >
      {value}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
};

export default Button;
