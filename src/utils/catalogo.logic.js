export function sanitizeCantidad(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return Math.floor(n);
}

export function buildDescripcion(codigo, categoria, mapa) {
  if (mapa && Object.prototype.hasOwnProperty.call(mapa, codigo)) return mapa[codigo];
  return categoria;
}

