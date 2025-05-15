import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import AddToCartButton from '../components/AddToCartButton';

const endpoint = 'http://localhost:8000/graphql';

const PRODUCT_BY_SKU_QUERY = gql`
  query GetProductBySku($sku: String!) {
    product(sku: $sku) {
      id
      sku
      name
      price
      in_stock
      description
      gallery
      attributes {
        name
        type
        items
      }
    }
  }
`;

interface AttributeSet {
  name: string;
  type: string;
  items: string[];
}

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  in_stock: boolean;
  description: string;
  gallery: string[];
  attributes: AttributeSet[];
}

function ProductDetailsPage() {
  const { sku } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sku) {
      setError(true);
      setLoading(false);
      return;
    }

    request<{ product: Product }>(endpoint, PRODUCT_BY_SKU_QUERY, { sku })
      .then((data) => {
        if (!data.product) setError(true);
        else setProduct(data.product);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sku]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error || !product) return <div style={{ padding: '2rem' }}>Product not found.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.name}</h1>
      <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      <p><strong>Description:</strong> {product.description}</p>

      {product.gallery.length > 0 && (
        <img
          src={product.gallery[0]}
          alt={product.name}
          style={{ width: '300px', marginBottom: '1rem' }}
        />
      )}

      <p><strong>Attributes:</strong></p>
      {product.attributes.map((attrSet, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <p>{attrSet.name} ({attrSet.type}):</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {attrSet.items.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}

      {product.in_stock ? (
        <AddToCartButton
          sku={product.sku}
          name={product.name}
          price={product.price}
        />
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</p>
      )}
    </div>
  );
}

export default ProductDetailsPage;