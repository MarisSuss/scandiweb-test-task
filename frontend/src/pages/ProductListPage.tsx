import React, { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import { useParams, Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';

const endpoint = 'http://localhost:8000/graphql';

const PRODUCT_LIST_QUERY = gql`
  query GetProducts($category: String) {
    products(category: $category) {
      id
      sku
      name
      price
      category {
        name
      }
      attributes {
        name
      }
    }
  }
`;

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number | string | null;
  category: {
    name: string;
  };
  attributes: { name: string }[];
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
        console.log('Loaded products:', data.products);
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
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
            <div>
              Price:{' '}
              {product.price !== null && !isNaN(Number(product.price))
                ? `$${Number(product.price).toFixed(2)}`
                : 'N/A'}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Link to={`/${product.category.name}/${product.sku}`}>
                <button style={{ marginRight: '0.5rem' }}>View</button>
              </Link>
              <AddToCartButton
                sku={product.sku}
                name={product.name}
                price={Number(product.price) || 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;