import React from 'react';

import './../styles/user/tooltip.css';

class ToolTip extends React.Component {
  render() {
    const toolTipPosition = {
      top: `${this.props.positionTop}%`,
      left: `${this.props.positionLeft}%`
    };
    return (
      <div className="tool-tip" style={toolTipPosition}>
        <span className="tool-tip-text">{this.props.toolTipText}</span>
      </div>
    );
  }
}

export default ToolTip;
