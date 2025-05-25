import { useCart } from '../context/CartContext';
import { useCartUI } from '../context/CartUIContext';

export default function AddToCartButton({
  product,
  selectedAttributes,
  disabled = false,
}: {
  product: any;
  selectedAttributes: { [key: string]: string };
  disabled?: boolean;
}) {
  const { dispatch } = useCart();
  const { openCart } = useCartUI();

  const handleAdd = () => {
    if (disabled) return;
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
    openCart();
  };

  const allAttributesSelected = product.attributes.every(
    (attr: any) => selectedAttributes[attr.id]
  );

  return (
    <button
      onClick={handleAdd}
      disabled={!allAttributesSelected || disabled}
      data-testid="add-to-cart"
      className={`w-full py-4 mt-2 text-lg font-semibold text-white transition ${
        !allAttributesSelected || disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
      style={{ borderRadius: 0 }}
    >
      Add to Cart
    </button>
  );
}