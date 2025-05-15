import React from 'react';
import { useCart } from '../context/CartContext';

interface AddToCartButtonProps {
  sku: string;
  name: string;
  price: number;
  attributes?: string[];
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ sku, name, price, attributes = [] }) => {
  const { dispatch } = useCart();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        sku,
        name,
        price,
        quantity: 1,
        attributes,
      },
    });
    alert(`${name} added to cart!`);
  };

  return <button onClick={handleAdd}>Add to Cart</button>;
};

export default AddToCartButton;