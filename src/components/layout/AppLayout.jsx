import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
        <main className="">
          <Outlet />
        </main>
    </div>
  );
};

export default AppLayout; 