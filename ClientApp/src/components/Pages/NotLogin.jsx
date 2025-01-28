import React from 'react';
import { Link  } from 'react-router-dom';

const NotLogin = () => {
    return (
      <div className="App center">
        <header className="App-header">
          <h2>Login to navigate HDC</h2>
        </header>
        <Link to="/Login">Login</Link>
      </div>
    );
}

export default NotLogin;
