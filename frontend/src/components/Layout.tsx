import { useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartOverlay from './CartOverlay';

const categories = ['all', 'clothes', 'tech'];

export default function Layout() {
  const { category } = useParams();
  const { state } = useCart();
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const [showCart, setShowCart] = useState(false);

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

        <button onClick={() => setShowCart(true)} className="relative text-xl">
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {showCart && <CartOverlay onClose={() => setShowCart(false)} />}
    </div>
  );
}