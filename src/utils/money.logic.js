export function parseCLP(str) {
  if (!str) return 0;
  const digits = String(str).replace(/[^0-9]/g, '');
  return Number.parseInt(digits || '0', 10);
}

export function formatCLP(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(value) || 0);
}

