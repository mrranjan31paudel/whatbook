import React from 'react';
import './../styles/loginsignup/TextField.css';

class TextField extends React.Component {
  changeHandle = e => {
    this.props.onChange(e.target.name, e.target.value);
  };
  render() {
    return (
      <input
        className={'input-field' + this.props.className}
        name={this.props.name}
        type={this.props.type}
        placeholder={this.props.placeHolder}
        onChange={this.changeHandle}
        autoComplete={this.props.autoComplete}
      ></input>
    );
  }
}

export default TextField;
