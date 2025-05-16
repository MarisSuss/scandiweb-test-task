import React from 'react';

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

type Price = {
  currency: string;
  amount: number;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  sku: string;
  gallery: string[];
  description: string;
  in_stock: boolean;
  prices: Price[];
  attributes: AttributeSet[];
};

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    console.log('Adding to cart:', product);
  };

  return (
    <button onClick={handleAddToCart} className="bg-green-500 text-white px-4 py-2 mt-4">
      Add to Cart
    </button>
  );
}