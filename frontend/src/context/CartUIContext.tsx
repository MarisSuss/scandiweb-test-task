import { createContext, useContext } from 'react';

type CartUIContextType = {
  openCart: () => void;
};

export const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) throw new Error("useCartUI must be used within CartUIContext.Provider");
  return context;
}