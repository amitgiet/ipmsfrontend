import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const AppLayout = () => {
  const {pathname} = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
     {!pathname.includes('dashboard') && !pathname.includes('client-project') && !pathname.includes('/settings') && <Header />}
        <main className="">
          <Outlet />
        </main>
    </div>
  );
};

export default AppLayout; 