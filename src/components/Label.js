import React from 'react';

import './../styles/loginsignup/label.css';

const Label = props => {
  return (
    <label className={props.className} htmlFor={props.htmlFor}>
      {props.value}
    </label>
  );
}

export default Label;
