import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import ProductListPage from './pages/ProductListPage';

function AddProductPage() {
  return <h1>Add Product Page</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);