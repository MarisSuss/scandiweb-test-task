import { useCart } from '../context/CartContext';

export default function AddToCartButton({
  product,
  selectedAttributes,
}: {
  product: any;
  selectedAttributes: { [key: string]: string };
}) {
  const { dispatch } = useCart();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        gallery: product.gallery,
        quantity: 1,
        selectedAttributes,
        attributes: product.attributes,
      },
    });
  };

  const allAttributesSelected = product.attributes.every(
    (attr: any) => selectedAttributes[attr.id]
  );

  return (
    <button
      onClick={handleAdd}
      disabled={!allAttributesSelected}
      data-testid="add-to-cart"
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add to Cart
    </button>
  );
}