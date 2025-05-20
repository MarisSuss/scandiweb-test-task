import { useCart } from '../context/CartContext';

export default function CartOverlay({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange: (
    id: string,
    selectedAttributes: { [key: string]: string },
    newQty: number
  ) => void = (id, selectedAttributes, newQty) => {
    if (newQty <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedAttributes } });
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity: newQty, selectedAttributes },
      });
    }
  };

  return (
    <div className="absolute top-16 right-4 z-50 bg-white border shadow-lg w-[420px] p-6 max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">×</button>

      <h2 className="text-xl font-bold mb-6">
        My Bag, <span className="font-normal">{state.items.length} items</span>
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

                  return (
                    <div key={key}>
                      <div className="font-semibold mb-1">{key}:</div>
                      <div className="flex gap-2">
                        {attributeSet?.items.map((attrItem: any) => {
                          const isSelected = attrItem.id === value;

                          return (
                            <button
                              key={attrItem.id}
                              className={`border rounded disabled cursor-default ${
                                isColor
                                  ? `w-6 h-6`
                                  : `px-2 py-1 text-sm`
                              } ${
                                isSelected
                                  ? isColor
                                    ? 'ring-2 ring-black'
                                    : 'bg-black text-white'
                                  : ''
                              }`}
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

          <div className="flex flex-col items-center justify-between w-24 shrink-0">
            <button
              onClick={() =>
                handleQuantityChange(item.id, item.selectedAttributes, item.quantity + 1)
              }
              className="border w-8 h-8 text-lg font-bold"
            >
              +
            </button>

            <span className="font-medium">{item.quantity}</span>

            <button
              onClick={() =>
                handleQuantityChange(item.id, item.selectedAttributes, item.quantity - 1)
              }
              className="border w-8 h-8 text-lg font-bold"
            >
              −
            </button>

            <img
              src={item.gallery?.[0]}
              alt={item.name}
              className="mt-2 w-full h-24 object-cover"
            />
          </div>
        </div>
      ))}

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => {
            dispatch({ type: 'CLEAR_CART' });
            onClose();
            alert('Order placed!');
          }}
          className="w-full bg-green-600 text-white py-3 font-bold rounded hover:bg-green-700 transition"
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}