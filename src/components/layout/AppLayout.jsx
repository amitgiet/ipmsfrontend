import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from './Header';
import { UniversalHeader } from '../common/UniversalHeader';
const AppLayout = () => {
  // const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* {!pathname.includes('dashboard') && !pathname.includes('client-project') && !pathname.includes('/settings') &&
        <Header />
      } */}
      <UniversalHeader />

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout; 