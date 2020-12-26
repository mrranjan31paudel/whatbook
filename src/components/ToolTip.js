import React from 'react';

import './../styles/user/tooltip.css';

const ToolTip = (props) => {
  const toolTipPosition = {
    top: `${props.positionTop}%`,
    left: `${props.positionLeft}%`,
  };

  return (
    <div className="tool-tip" style={toolTipPosition}>
      <span className="tool-tip-text">{props.toolTipText}</span>
    </div>
  );
};

export default ToolTip;
