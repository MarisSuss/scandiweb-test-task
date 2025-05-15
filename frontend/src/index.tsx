import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { CartProvider } from './context/CartContext';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/:category?" element={<ProductListPage />} />
            <Route path="/:categoryName/:sku" element={<ProductDetailsPage />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);