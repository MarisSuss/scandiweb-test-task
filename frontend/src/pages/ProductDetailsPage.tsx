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

  const nextImage = () => {
    if (mainImageIndex < product.gallery.length - 1) {
      setMainImageIndex(mainImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto p-6">
      {/* Thumbnail column */}
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
        {product.gallery.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            onClick={() => setMainImageIndex(index)}
            className="w-20 h-20 object-cover cursor-pointer border"
            data-testid="product-gallery"
          />
        ))}
      </div>

      {/* Main image with arrows */}
      <div className="relative flex-1 max-w-xl flex items-center justify-center">
        <button
          onClick={prevImage}
          disabled={mainImageIndex === 0}
          className="absolute left-2 w-8 h-8 flex items-center justify-center text-white text-xl bg-black bg-opacity-50 opacity-70 hover:opacity-100"
        >
          ‹
        </button>
        <img
          src={product.gallery[mainImageIndex]}
          alt={product.name}
          className="w-full object-cover"
        />
        <button
          onClick={nextImage}
          disabled={mainImageIndex === product.gallery.length - 1}
          className="absolute right-2 w-8 h-8 flex items-center justify-center text-white text-xl bg-black bg-opacity-50 opacity-70 hover:opacity-100"
        >
          ›
        </button>
      </div>

      {/* Details panel */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        {product.attributes.map((attrSet) => {
          const isColor = attrSet.name.toLowerCase() === 'color';
          const kebabName = attrSet.name.toLowerCase().replace(/\s+/g, '-');
          return (
            <div key={attrSet.id} className="mb-6" data-testid={`product-attribute-${kebabName}`}>
              <h4 className="uppercase font-bold text-sm mb-2">{attrSet.name}:</h4>
              <div className="flex gap-2">
                {attrSet.items.map((item) => {
                  const isSelected = selectedAttributes[attrSet.id] === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`border ${
                        isColor ? 'w-8 h-8 border-white' : 'px-4 py-1 text-sm'
                      } rounded transition ${
                        isSelected
                          ? isColor
                            ? 'ring-2 ring-green-500'
                            : 'bg-black text-white'
                          : ''
                      }`}
                      style={isColor ? { backgroundColor: item.value } : {}}
                      onClick={() => handleSelectAttribute(attrSet.id, item.id)}
                      data-testid={
                        isSelected
                          ? `cart-item-attribute-${kebabName}-${item.id.toLowerCase()}-selected`
                          : `cart-item-attribute-${kebabName}-${item.id.toLowerCase()}`
                      }
                    >
                      {!isColor && item.displayValue}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mb-4">
          <h4 className="uppercase font-bold text-sm mb-2">Price:</h4>
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <AddToCartButton product={product} selectedAttributes={selectedAttributes} />
        </div>

        <div
          className="text-sm text-gray-600 leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </div>
      </div>
    </div>
  );
}