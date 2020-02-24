import React from 'react';

import './../styles/common/Button.css';

class Button extends React.Component {
  render() {
    return (
      <button className={'submit-button' + this.props.className} type={this.props.type} disabled={this.props.isDisabled}>{this.props.value}</button>
    )
  }
}

export default Button;
