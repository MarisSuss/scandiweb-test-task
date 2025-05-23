import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import DOMPurify from 'dompurify';
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

type Product = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  gallery: string[];
  description: string;
  in_stock: boolean;
  price: number;
  attributes: {
    id: string;
    name: string;
    type: string;
    items: {
      id: string;
      value: string;
      displayValue: string;
    }[];
  }[];
};

export default function ProductDetailsPage() {
  const { sku } = useParams();
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { data, isLoading } = useQuery<{ product: Product }>({
    queryKey: ['product', sku],
    queryFn: () => request(import.meta.env.VITE_API_URL, QUERY, { sku }),
  });

  const product = data?.product;

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  const handleSelectAttribute = (attrId: string, value: string) => {
    setSelectedAttributes((prev) => ({ ...prev, [attrId]: value }));
  };

  return (
    <div className="flex gap-6">
      <div data-testid="product-gallery" className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
        {product.gallery.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            onClick={() => setMainImageIndex(index)}
            className="w-20 h-20 object-cover cursor-pointer border"
          />
        ))}
      </div>

      <div className="flex-1">
        <img
          src={product.gallery[mainImageIndex]}
          alt={product.name}
          className="mb-4 w-full max-w-md object-cover"
        />

        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-4">Brand: {product.brand}</p>

        {product.attributes.map((attrSet: Product['attributes'][number]) => {
          const isColor = attrSet.name.toLowerCase() === 'color';
          const kebabName = attrSet.name.toLowerCase().replace(/\s+/g, '-');

          return (
            <div key={attrSet.id} className="mb-4" data-testid={`product-attribute-${kebabName}`}>
              <h4 className="font-semibold mb-1">{attrSet.name}</h4>
              <div className="flex gap-2">
                {attrSet.items.map((item: typeof attrSet.items[number]) => {
                  const isSelected = selectedAttributes[attrSet.id] === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`border rounded text-sm ${isColor ? 'w-8 h-8' : 'px-3 py-1'} ${
                        isSelected ? (isColor ? 'ring-2 ring-black' : 'bg-blue-600 text-white') : ''
                      }`}
                      style={isColor ? { backgroundColor: item.value } : {}}
                      onClick={() => handleSelectAttribute(attrSet.id, item.id)}
                    >
                      {!isColor && item.displayValue}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <p className="text-lg font-semibold mb-2">${product.price.toFixed(2)}</p>

        <AddToCartButton product={product} selectedAttributes={selectedAttributes} />

        <div
          className="mt-4"
          data-testid="product-description"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
        />
      </div>
    </div>
  );
}