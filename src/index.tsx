import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './component/GoogleLogin/Login'; // Import the Login component
import App from './App';
import './index.css'; // Import the global CSS

ReactDOM.render(
  <BrowserRouter>
    <Login />
  </BrowserRouter>,
  document.getElementById('root')
);
