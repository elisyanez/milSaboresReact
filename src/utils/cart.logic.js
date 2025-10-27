import { parseCLP } from './money.logic.js';

export function groupItems(items) {
  const map = new Map();
  for (const it of items || []) {
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
}

export function updateQuantityInList(list, codigo, nuevaCantidad) {
  const prev = Array.from(list || []);
  const rep = prev.find((p) => p.codigo === codigo);
  const others = prev.filter((p) => p.codigo !== codigo);
  const qty = Number(nuevaCantidad) || 0;
  if (!rep || qty <= 0) return others;
  return [
    ...others,
    { codigo: rep.codigo, nombre: rep.nombre, precio: rep.precio, img: rep.img, cantidad: qty },
  ];
}

export function removeQuantityInList(list, codigo, qtyToRemove) {
  const prev = Array.from(list || []);
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
}

export function countItems(items) {
  return (items || []).reduce((acc, it) => acc + (Number(it.cantidad) || 1), 0);
}

export function totalFromGrouped(grouped) {
  return (grouped || []).reduce(
    (acc, it) => acc + parseCLP(it.precio) * (Number(it.cantidad) || 1),
    0
  );
}

