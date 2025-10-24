import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { currentUser } = useUser();
  const storageKey = useMemo(() => `cart_${currentUser?.run || 'guest'}`, [currentUser]);

  // Load cart when user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  // Persist cart per-user
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clear = () => setItems([]);

  const parseCLP = (str) => {
    if (!str) return 0;
    const digits = String(str).replace(/[^0-9]/g, '');
    return Number.parseInt(digits || '0', 10);
  };

  const groupedItems = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const key = it.codigo;
      const prev = map.get(key);
      if (prev) {
        prev.cantidad += Number(it.cantidad) || 1;
      } else {
        map.set(key, {
          codigo: it.codigo,
          nombre: it.nombre,
          precio: it.precio,
          img: it.img,
          cantidad: Number(it.cantidad) || 1,
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const updateQuantity = (codigo, nuevaCantidad) => {
    setItems((prev) => {
      const rep = prev.find((p) => p.codigo === codigo);
      const others = prev.filter((p) => p.codigo !== codigo);
      const qty = Number(nuevaCantidad) || 0;
      if (!rep || qty <= 0) return others;
      return [
        ...others,
        { codigo: rep.codigo, nombre: rep.nombre, precio: rep.precio, img: rep.img, cantidad: qty },
      ];
    });
  };

  const removeQuantity = (codigo, qtyToRemove) => {
    setItems((prev) => {
      const current = prev.filter((p) => p.codigo === codigo);
      const others = prev.filter((p) => p.codigo !== codigo);
      const totalQty = current.reduce((a, c) => a + (Number(c.cantidad) || 1), 0);
      const newQty = Math.max(0, totalQty - (Number(qtyToRemove) || 0));
      if (newQty <= 0) return others;
      const rep = current[0];
      return [
        ...others,
        { codigo: rep.codigo, nombre: rep.nombre, precio: rep.precio, img: rep.img, cantidad: newQty },
      ];
    });
  };

  const totalCount = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0);
  }, [items]);

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
