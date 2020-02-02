import React from 'react';
import './../../styles/loginsignup/Label.css';

class Label extends React.Component {
  render() {
    return (
    <label className={this.props.className} htmlFor={this.props.htmlFor}>{this.props.value}</label>
    )
  }
}

export default Label;
