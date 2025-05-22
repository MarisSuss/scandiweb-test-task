import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import AddToCartButton from '../components/AddToCartButton';

const QUERY = gql`
  query getProductBySku($sku: String!) {
    product(sku: $sku) {
      id
      name
      sku
      brand
      gallery
      description
      in_stock
      price
      attributes {
        id
        name
        type
        items {
          id
          displayValue
          value
        }
      }
    }
  }
`;

type AttributeItem = {
  displayValue: string;
  value: string;
  id: string;
};

type AttributeSet = {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
};

type Product = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  gallery: string[];
  description: string;
  in_stock: boolean;
  price: number;
  attributes: AttributeSet[];
};

export default function ProductDetailsPage() {
  const { sku } = useParams();
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

  const { data, isLoading } = useQuery<{ product: Product }>({
    queryKey: ['product', sku],
    queryFn: () => request('http://localhost:4000/graphql', QUERY, { sku }),
  });

  const product = data?.product;

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  const handleSelectAttribute = (attrId: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrId]: value }));
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">Brand: {product.brand}</p>
      <img
        src={product.gallery[0]}
        alt={product.name}
        className="mb-4 w-full max-w-md object-cover"
      />
      <p className="mb-4">{product.description}</p>

      <p className="text-lg font-semibold mb-2">
        ${product.price.toFixed(2)}
      </p>

      {product.attributes.map((attrSet) => (
        <div key={attrSet.id} className="mb-4">
          <h4 className="font-semibold mb-1">{attrSet.name}</h4>
          <div className="flex gap-2">
            {attrSet.items.map((item) => {
              const isSelected = selectedAttributes[attrSet.id] === item.id;
              return (
                <button
                  key={item.id}
                  className={`border px-3 py-1 rounded text-sm ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white'
                  }`}
                  onClick={() => handleSelectAttribute(attrSet.id, item.id)}
                >
                  {item.displayValue}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <AddToCartButton product={product} selectedAttributes={selectedAttributes} />
    </div>
  );
}