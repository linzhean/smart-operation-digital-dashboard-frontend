import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './component/Common/Navbar';

const NavbarRoute: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default NavbarRoute;