import React from 'react';

import './../styles/loginsignup/dropdown.css';

const Dropdown = (props) => {
  return (
    <select
      className={'drop-list' + props.status}
      name={props.name}
      onChange={(e) => props.onChange(e.target.value, e.target.name)}
    >
      {Object.keys(props.options).map((key) => (
        <option key={key} value={`${key}`}>
          {props.options[key]}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
