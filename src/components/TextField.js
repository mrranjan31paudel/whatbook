import React from 'react';

import './../styles/loginsignup/text_field.css';

const TextField = (props) => {
  return (
    <input
      className={'input-field' + props.className}
      name={props.name}
      type={props.type}
      placeholder={props.placeHolder}
      onChange={(e) => props.onChange(e.target.name, e.target.value)}
      autoComplete={props.autoComplete}
    />
  );
};

export default TextField;
