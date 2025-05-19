import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { state, dispatch } = useCart();

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {state.items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          {state.items.map((item, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded">
              <img src={item.gallery[0]} alt={item.name} className="h-24 object-cover mb-2" />
              <h2 className="font-medium">{item.name}</h2>

              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) },
                    })
                  }
                  className="px-2 py-1 border rounded"
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
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <p>Price: ${item.price.toFixed(2)}</p>
              <button
                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                className="mt-2 text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <h2 className="text-xl font-semibold mt-6">Total: ${total.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}