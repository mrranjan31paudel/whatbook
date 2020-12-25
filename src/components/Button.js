import React from 'react';

import './../styles/common/button.css';

const Button = props => {
  const { className, type, isDisabled, value } = props;

  return (
    <button
      className={'submit-button' + className}
      type={type}
      disabled={isDisabled}>
      {value}
    </button>
  );
}

export default Button;
