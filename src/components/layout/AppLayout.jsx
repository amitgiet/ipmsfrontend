import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  const {pathname} = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
     {! pathname.includes('dashboard' || 'client-project') && <Header />}
        <main className="">
          <Outlet />
        </main>
    </div>
  );
};

export default AppLayout; 