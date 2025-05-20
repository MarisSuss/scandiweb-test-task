import { createContext, useContext, useEffect, useReducer } from 'react';

type SelectedAttribute = {
  [attributeId: string]: string;
};

type AttributeSet = {
  id: string;
  name: string;
  type: string;
  items: { id: string; value: string; displayValue: string }[];
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  gallery: string[];
  quantity: number;
  selectedAttributes: SelectedAttribute;
  attributes: AttributeSet[];
};

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string; selectedAttributes: SelectedAttribute } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; selectedAttributes: SelectedAttribute } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item =>
          item.id === action.payload.id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id &&
            JSON.stringify(item.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          item =>
            item.id !== action.payload.id ||
            JSON.stringify(item.selectedAttributes) !== JSON.stringify(action.payload.selectedAttributes)
        ),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        dispatch({ type: 'CLEAR_CART' });
        const parsed = JSON.parse(stored);
        parsed.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
        });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}