import React, { JSX, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, request } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

const PRODUCT_BY_SKU_QUERY = gql`
  query GetProductBySku($sku: String!) {
    product(sku: $sku) {
      id
      name
      price
      in_stock
      description
      gallery
      attributes
    }
  }
`;

interface Product {
  id: number;
  name: string;
  price: number;
  in_stock: boolean;
  description: string;
  gallery: string[];
  attributes: string[];
}

function ProductDetailsPage(): JSX.Element {
  const { sku } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sku) return;

    request<{ product: Product }>(endpoint, PRODUCT_BY_SKU_QUERY, { sku })
      .then((data) => {
        setProduct(data.product);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sku]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '2rem' }}>Product not found.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Description:</strong> {product.description}</p>

      {product.gallery.length > 0 && (
        <img src={product.gallery[0]} alt={product.name} style={{ width: '300px', marginBottom: '1rem' }} />
      )}

      <p><strong>Attributes:</strong></p>
      <ul>
        {product.attributes.map((attr, idx) => (
          <li key={idx}>{attr}</li>
        ))}
      </ul>

      {product.in_stock ? (
        <button>Add to Cart</button>
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</p>
      )}
    </div>
  );
}

export default ProductDetailsPage;