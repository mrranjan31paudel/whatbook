import React from 'react';

import { NONE, DELETE_ONLY, EDIT_DELETE } from './../constants/permissionOptions';

import './../styles/user/popupmenu.css';

class PopUpMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      optionList: NONE,
    }
  }

  componentDidMount() {
    if (this.props.config.rights === 'd') {
      this.setState({
        optionList: DELETE_ONLY
      });
    }
    else if (this.props.config.rights === 'ed') {
      this.setState({
        optionList: EDIT_DELETE
      });
    }
  }

  handleItemClick = (e, value) => {
    this.props.onItemClick(value);
  }

  render() {
    const popUpPosition = {
      top: `calc(${this.props.config.posY}px - 8vmin)`,
      left: `calc(${this.props.config.posX}px - 120px)`
    }
    return (
      <ul id="pop-up-menu" style={popUpPosition}>
        {this.state.optionList.map((listValue, index) => <li key={index} onClick={(e) => this.handleItemClick(e, listValue)} value={listValue}>{listValue}</li>)}
      </ul>
    );
  }
}

export default PopUpMenu;