import { useCart } from '../context/CartContext';
import { gql, request } from 'graphql-request';

const ADD_ORDER = gql`
  mutation AddOrder($input: [OrderItemInput!]!) {
    addOrder(input: $input) {
      success
      orderId
    }
  }
`;

interface AddOrderResponse {
  addOrder: {
    success: boolean;
    orderId: number;
  };
}

export default function CartOverlay({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (
    id: string,
    selectedAttributes: { [key: string]: string },
    newQty: number
  ) => {
    if (newQty <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedAttributes } });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity: newQty, selectedAttributes },
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (state.items.length === 0) return;

    const input = state.items.map(item => ({
      product_id: parseInt(item.id),
      quantity: item.quantity,
      selectedAttributes: JSON.stringify(item.selectedAttributes),
    }));

    try {
      const response: AddOrderResponse = await request(import.meta.env.VITE_API_URL, ADD_ORDER, { input });
      if (response.addOrder.success) {
        alert(`Order placed! ID: ${response.addOrder.orderId}`);
        dispatch({ type: 'CLEAR_CART' });
        onClose();
      } else {
        alert('Failed to place order.');
      }
    } catch (err: any) {
      alert('Error placing order: ' + err.message);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="absolute top-19 left-0 w-full h-[calc(100%-4rem)] z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      />

      <div className="absolute top-16 right-4 z-50 bg-white shadow-lg w-[420px] p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-6">
          My Bag, <span className="font-normal">
            {state.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            {state.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
          </span>
        </h2>

        {state.items.map((item, idx) => (
          <div key={idx} className="mb-6 pb-6 border-b last:border-none last:pb-0 flex gap-4">
            <div className="flex-1 text-sm">
              <h3 className="font-bold">{item.name}</h3>
              <p className="font-bold mt-1">${item.price.toFixed(2)}</p>

              {item.selectedAttributes && (
                <div className="mt-3 space-y-3">
                  {Object.entries(item.selectedAttributes).map(([key, value]) => {
                    const attributeSet = item.attributes?.find((a: any) => a.name === key);
                    const isColor = key.toLowerCase() === 'color';
                    const kebabKey = key.toLowerCase().replace(/\s+/g, '-');

                    return (
                      <div key={key} data-testid={`cart-item-attribute-${kebabKey}`}>
                        <div className="font-semibold mb-1">{key}:</div>
                        <div className="flex gap-2">
                          {attributeSet?.items.map((attrItem: any) => {
                            const isSelected = attrItem.id === value;
                            const kebabVal = attrItem.id.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <button
                                key={attrItem.id}
                                data-testid={`cart-item-attribute-${kebabKey}-${kebabVal}${isSelected ? '-selected' : ''}`}
                                className={`border rounded disabled cursor-default ${
                                  isColor ? 'w-6 h-6 border-white' : 'px-2 py-1 text-sm'
                                } ${isSelected ? (isColor ? 'ring-2 ring-green-500' : 'bg-black text-white') : ''}`}
                                style={isColor ? { backgroundColor: attrItem.value } : {}}
                                disabled
                              >
                                {!isColor && attrItem.value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between items-center">
              <button
                data-testid="cart-item-amount-increase"
                onClick={() => handleQuantityChange(item.id, item.selectedAttributes, item.quantity + 1)}
                className="border w-6 h-6 text-sm font-bold"
              >
                +
              </button>
              <span data-testid="cart-item-amount" className="text-sm">
                {item.quantity}
              </span>
              <button
                data-testid="cart-item-amount-decrease"
                onClick={() => handleQuantityChange(item.id, item.selectedAttributes, item.quantity - 1)}
                className="border w-6 h-6 text-sm font-bold"
              >
                −
              </button>
            </div>

            <img
              src={item.gallery?.[0]}
              alt={item.name}
              className="w-40 h-50 object-cover"
            />
          </div>
        ))}

        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-lg font-bold" data-testid="cart-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            data-testid="place-order"
            onClick={handlePlaceOrder}
            disabled={state.items.length === 0}
            className={`w-full py-3 font-bold rounded transition ${
              state.items.length === 0
                ? 'bg-green-600 opacity-50 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
}