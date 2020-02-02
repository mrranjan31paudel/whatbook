import React from 'react';
import './../../styles/loginsignup/Dropdown.css';

class Dropdown extends React.Component {
  render() {
    const itemKeys = Object.keys(this.props.items);
    const itemValues = Object.values(this.props.items);
    return (
      <select className={'drop-list'+this.props.status} name={this.props.className} onChange={(e) => this.props.onChange(e.target.value, e.target.name)}>
        {itemKeys.map((itemValue, itemIndex) => <option key={itemValue} value={`${itemValue}`}>{itemValues[itemIndex]}</option>)}
      </select>
    );
  }
}

export default Dropdown;