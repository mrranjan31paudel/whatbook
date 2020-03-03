import React from 'react';

import './../styles/user/noServerConnection.css';

class NoServerConnection extends React.Component {
  render() {
    return (
      <div className="no-server-connection">
        <h1>
          Connection to The Server is Lost!!!
          </h1>
      </div>
    );
  }
}

export default NoServerConnection;