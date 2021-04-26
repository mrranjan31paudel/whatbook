import React from 'react';

import './../styles/loginsignup/dropdown.css';

const Dropdown = (props) => {
  return (
    <select
      className={'drop-list' + props.status}
      name={props.name}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value, e.target.name)}
    >
      {props.options ? (
        props.options.map(({ label, value }) => (
          <option key={value} value={`${value}`}>
            {label}
          </option>
        ))
      ) : (
        <option>No option</option>
      )}
    </select>
  );
};

export default Dropdown;
