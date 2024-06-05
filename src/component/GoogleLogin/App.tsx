import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login'; // Import the Login component
import Pdata from '../../Pdata/Pdata'; // Import the Pdata component

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/pdata" element={<Pdata />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;