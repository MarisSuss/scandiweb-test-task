import React, { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import { Link } from 'react-router-dom';

const endpoint = 'http://localhost:8000/graphql';

const PRODUCT_LIST_QUERY = gql`
  {
    products {
      id
      name
      price
      sku
    }
  }
`;

interface Product {
  id: number;
  name: string;
  price?: number; // Make price optional
  sku: string;
}

interface ProductListResponse {
  products: Product[];
}

function ProductListPage(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    request<ProductListResponse>(endpoint, PRODUCT_LIST_QUERY)
      .then(data => {
        setProducts(data.products);
      })
      .catch(err => {
        console.error('GraphQL error:', err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Product List</h1>
        <div>
          <Link to="/add-product">
            <button>Add</button>
          </Link>
          <button style={{ marginLeft: '1rem' }}>Mass Delete</button>
        </div>
      </div>
      <hr style={{ margin: '1rem 0' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <input type="checkbox" style={{ marginBottom: '0.5rem' }} />
            <div><strong>{product.sku}</strong></div>
            <div>{product.name}</div>
            <div>
              {typeof product.price === 'number'
                ? `$${product.price.toFixed(2)}`
                : 'Price not available'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;