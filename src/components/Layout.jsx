import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-deepest flex overflow-hidden font-body">
      <Sidebar />
      <main className="flex-1 ml-[220px] h-screen overflow-y-auto custom-scrollbar relative">
        <Navbar />
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
