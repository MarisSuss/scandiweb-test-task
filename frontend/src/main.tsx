import React from 'react';
import './main.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './components/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path=":category/:sku" element={<ProductDetailsPage />} />
              <Route path=":category?" element={<ProductListPage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>
);