import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();

const LocalStateProvicer = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is oour own custom provider, We wil store data (state) and functionality
  // (updaters) in here and anyone can access it via the consumer

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvicer
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvicer>
  );
}

// make a custom hook for accessing the car local state

function useCart() {
  // We use a consumer her eto access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
