import { useCart } from '../context/CartContext';

export default function CartOverlay({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="absolute top-16 right-4 z-50 bg-white border shadow-lg w-96 p-6 max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-2 right-2 text-xl">×</button>
      <h2 className="text-lg font-semibold mb-4">My Bag, {state.items.length} items</h2>

      {state.items.map((item, idx) => (
        <div key={idx} className="mb-6 border-b pb-4">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>

          {item.selectedAttributes && (
            <div className="mt-2 text-sm">
              {Object.entries(item.selectedAttributes).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) },
                })
              }
              className="border px-2"
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_QUANTITY',
                  payload: { id: item.id, quantity: item.quantity + 1 },
                })
              }
              className="border px-2"
            >
              +
            </button>
            <img src={item.gallery[0]} alt={item.name} className="ml-auto w-16 h-16 object-cover" />
          </div>
        </div>
      ))}

      <div className="mt-6">
        <div className="flex justify-between font-medium mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => {
            dispatch({ type: 'CLEAR_CART' });
            onClose();
            alert('Order placed!');
          }}
          className="w-full bg-green-600 text-white py-2 font-semibold"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}