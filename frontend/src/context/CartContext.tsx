import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  attributes: string[];
}

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; sku: string };

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.sku === action.item.sku);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.sku === action.item.sku
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE_FROM_CART':
      return { items: state.items.filter(i => i.sku !== action.sku) };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};