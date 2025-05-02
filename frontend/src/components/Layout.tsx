import React from 'react';
import { Outlet } from 'react-router-dom';
import CategoryNav from './CategoryNav';

const Layout = () => {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <nav>
          <CategoryNav />
        </nav>
      </header>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;