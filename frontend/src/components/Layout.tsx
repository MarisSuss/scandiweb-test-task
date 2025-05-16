import React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';

const categories = ['all', 'clothes', 'tech'];

export default function Layout() {
  const { category } = useParams();

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex gap-6 text-sm font-medium">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/${cat === 'all' ? '' : cat}`}
              className={`uppercase tracking-wide ${
                category === cat || (!category && cat === 'all')
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="text-xl">🛒</div>
      </header>
      <main className="p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}