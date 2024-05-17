import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './component/GoogleLogin/Login';

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);
