import React, { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import { Link, useParams } from 'react-router-dom';

const endpoint = 'http://localhost:8000/graphql';

const PRODUCT_LIST_QUERY = gql`
  query GetProducts($category: String) {
    products(category: $category) {
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
  price?: number;
  sku: string;
}

interface ProductListResponse {
  products: Product[];
}

function ProductListPage(): React.ReactElement {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    request<ProductListResponse>(endpoint, PRODUCT_LIST_QUERY, {
      category: category === 'all' ? undefined : category
    })
      .then(data => {
        setProducts(data.products);
      })
      .catch(err => {
        console.error('GraphQL error:', err);
      });
  }, [category]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{category ? `${category}` : 'All Products'}</h1>
      <hr style={{ margin: '1rem 0' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(product => (
          <Link
            key={product.id}
            to={`/${category ?? 'all'}/${product.sku}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
              <div><strong>{product.sku}</strong></div>
              <div>{product.name}</div>
              <div>
                {typeof product.price === 'number'
                  ? `$${product.price.toFixed(2)}`
                  : 'Price not available'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;