import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { dispatch } = useCart();

  const handleAdd = () => {
    const selectedAttributes = {};

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        gallery: product.gallery,
        quantity: 1,
        selectedAttributes,
      },
    });
  };

  return (
    <button onClick={handleAdd} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
      Add to Cart
    </button>
  );
}