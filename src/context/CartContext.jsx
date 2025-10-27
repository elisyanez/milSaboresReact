import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useUser } from './UserContext';
import { parseCLP } from '../utils/money.logic';
import { groupItems, updateQuantityInList, removeQuantityInList, countItems } from '../utils/cart.logic';
import { readCart, writeCart } from '../data/db';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { currentUser } = useUser();

  // Load cart when user changes
  useEffect(() => {
    setItems(readCart(currentUser?.run));
  }, [currentUser]);

  // Persist cart per-user
  useEffect(() => {
    writeCart(currentUser?.run, items);
  }, [items, currentUser]);

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setItems([]);

  const groupedItems = useMemo(() => groupItems(items), [items]);

  const updateQuantity = (codigo, nuevaCantidad) => {
    setItems((prev) => updateQuantityInList(prev, codigo, nuevaCantidad));
  };

  const removeQuantity = (codigo, qtyToRemove) => {
    setItems((prev) => removeQuantityInList(prev, codigo, qtyToRemove));
  };

  const totalCount = useMemo(() => countItems(items), [items]);

  const total = useMemo(() => {
    return groupedItems.reduce((acc, it) => acc + parseCLP(it.precio) * (Number(it.cantidad) || 1), 0);
  }, [groupedItems]);

  const value = useMemo(
    () => ({ items, groupedItems, addItem, removeItem, clear, updateQuantity, removeQuantity, count: totalCount, total }),
    [items, groupedItems, totalCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default CartContext;
