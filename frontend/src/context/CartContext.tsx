import { createContext, useContext, useEffect, useReducer } from 'react';

type SelectedAttribute = {
  [attributeId: string]: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  gallery: string[];
  quantity: number;
  selectedAttributes: SelectedAttribute;
};

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Updates to the cart
function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(item =>
        item.id === action.payload.id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item === existing
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}