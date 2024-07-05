import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Group from './component/Group';
import Pdata from './component/Pdata';
import Mail from './pages/Mail/Mail';
import './component/Bootstrap/css/bootstrap.min.css';
import NavBar from './component/Common/Navbar';
import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';
import AssignExportControl from './pages/AssignExportControl/AssignExportControl'

const Main: React.FC = () => {

  const [users, setUsers] = useState<any[]>([]);


  const addUser = () => {
    const newUser = {
      username: 'New User',
      department: 'New Department',
      name: 'New Name',
      gmail: 'New Gmail',
      position: 'New Position',
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (index: number) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };


  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/group" element={<Group users={users} addUser={addUser} deleteUser={deleteUser} />} />
        <Route path="/profile" element={<Pdata />} />
        <Route path="/email" element={<Mail />} />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
        <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
      </Routes>
    </div>
  );
};

export default Main;
