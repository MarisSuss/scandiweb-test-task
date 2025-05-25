import { useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartUIContext } from '../context/CartUIContext';
import CartOverlay from './CartOverlay';

const categories = ['all', 'clothes', 'tech'];

export default function Layout() {
  const { category } = useParams();
  const { state } = useCart();
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const [showCart, setShowCart] = useState(false);

  return (
    <CartUIContext.Provider value={{ openCart: () => setShowCart(true) }}> 
      <div className="w-3/5 mx-auto font-sans bg-white text-gray-900">
        <header>
          <div className="px-4 py-4 flex justify-between items-center">
            <nav className="flex gap-8 text-sm md:text-base">
              {categories.map((cat) => {
                const isActive = category === cat || (!category && cat === 'all');
                return (
                  <Link
                    key={cat}
                    to={`/${cat}`}
                    data-testid={isActive ? 'active-category-link' : 'category-link'}
                  >
                    <div
                      className={`inline-block text-sm md:text-base uppercase tracking-wide transition font-medium border-b-2 pt-2 pb-7 px-4 ${
                        isActive
                          ? 'text-green-500 border-green-500'
                          : 'text-black border-transparent hover:text-green-500'
                      }`}
                    >
                      {cat}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <button
              data-testid="cart-btn"
              onClick={() => setShowCart(prev => !prev)}
              className="relative text-xl"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </header>

        <main>
          <div className="pt-8">
            <Outlet />
          </div>
        </main>

        {showCart && <CartOverlay onClose={() => setShowCart(false)} />}
      </div>
    </CartUIContext.Provider>
  );
}