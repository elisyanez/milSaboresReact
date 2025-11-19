// Simulated data source for the app (catalog products and users)
// This module centralizes seed data similar to a simple in-memory DB.

// Catalog descriptions by product code
export const descripciones = {
  TC001: 'Bizcocho de cacao húmedo con capas de ganache de chocolate.',
  TC002: 'Bizcocho suave con frutas de temporada y crema pastelera ligera.',
  TT001: 'Bizcocho de vainilla esponjoso con buttercream de vainilla.',
  TT002: 'Bizcocho de vainilla relleno y cubierto con manjar.',
  PI001: 'Postre individual de mousse aireado de chocolate semiamargo.',
  PI002: 'Clásico italiano con queso mascarpone, café y cacao.',
  PSA001: 'Versión sin azúcar con jugo y ralladura de naranja.',
  PSA002: 'Cheesecake cremoso endulzado sin azúcar, sobre base crocante.',
  PT001: 'Clásica empanada dulce rellena de manzana especiada.',
  PT002: 'Tarta tradicional de almendra con cobertura de azúcar glas.',
  PG001: 'Brownie intenso y húmedo, libre de gluten.',
  PG002: 'Pan casero suave, elaborado sin gluten.',
  PV001: 'Torta vegana de cacao intenso, sin lácteos ni huevos.',
  PV002: 'Galletas crujientes de avena con chips de chocolate.',
  TE001: 'Torta personalizada para cumpleaños, sabores y decoración a elección.',
  TE002: 'Elegante torta nupcial por pisos, diseño a medida.',
};

// Catalog products
export const productos = [
  { codigo: 'TC001', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: '$45.000 CLP', img: '/IMG/torta-chocolate.jpg' },
  { codigo: 'TC002', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Frutas', precio: '$50.000 CLP', img: '/IMG/torta-frutas.jpg' },
  { codigo: 'TT001', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Vainilla', precio: '$40.000 CLP', img: '/IMG/torta-vainilla.jpg' },
  { codigo: 'TT002', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Manjar', precio: '$42.000 CLP', img: '/IMG/torta-manjar.png' },
  { codigo: 'PI001', categoria: 'Postres Individuales', nombre: 'Mousse de Chocolate', precio: '$5.000 CLP', img: '/IMG/mousse-chocolate.png' },
  { codigo: 'PI002', categoria: 'Postres Individuales', nombre: 'Tiramisú Clásico', precio: '$5.500 CLP', img: '/IMG/tiramisu.png' },
  { codigo: 'PSA001', categoria: 'Productos Sin Azúcar', nombre: 'Torta Sin Azúcar de Naranja', precio: '$48.000 CLP', img: '/IMG/torta-naranja-sin-azucar.png' },
  { codigo: 'PSA002', categoria: 'Productos Sin Azúcar', nombre: 'Cheesecake Sin Azúcar', precio: '$47.000 CLP', img: '/IMG/cheesecake-sin-azucar.png' },
  { codigo: 'PT001', categoria: 'Pastelería Tradicional', nombre: 'Empanada de Manzana', precio: '$3.000 CLP', img: '/IMG/empanada-manzana.png' },
  { codigo: 'PT002', categoria: 'Pastelería Tradicional', nombre: 'Tarta de Santiago', precio: '$6.000 CLP', img: '/IMG/tarta-santiago.png' },
  { codigo: 'PG001', categoria: 'Productos Sin Gluten', nombre: 'Brownie Sin Gluten', precio: '$4.000 CLP', img: '/IMG/brownie-sin-gluten.png' },
  { codigo: 'PG002', categoria: 'Productos Sin Gluten', nombre: 'Pan Sin Gluten', precio: '$3.500 CLP', img: '/IMG/pan-sin-gluten.png' },
  { codigo: 'PV001', categoria: 'Productos Veganos', nombre: 'Torta Vegana de Chocolate', precio: '$50.000 CLP', img: '/IMG/torta-vegana-chocolate.png' },
  { codigo: 'PV002', categoria: 'Productos Veganos', nombre: 'Galletas Veganas de Avena', precio: '$4.500 CLP', img: '/IMG/galletas-vegana-avena.png' },
  { codigo: 'TE001', categoria: 'Tortas Especiales', nombre: 'Torta Especial de Cumpleaños', precio: '$55.000 CLP', img: '/IMG/torta-cumpleanos.png' },
  { codigo: 'TE002', categoria: 'Tortas Especiales', nombre: 'Torta Especial de Boda', precio: '$60.000 CLP', img: '/IMG/torta-boda.png' },
];

// Products persistence (visibility, edits) in localStorage
const PRODUCTS_KEY = 'productos_v1';

export function readProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return getProducts();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return getProducts();
    return parsed;
  } catch {
    return getProducts();
  }
}

export function writeProducts(list) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list || []));
}

// Example seed users (can be loaded into localStorage by your context)
export const seedUsers = [
  {
    run: 'admin123',
    nombre: 'Admin',
    apellidos: 'General',
    correo: 'admin@local',
    role: 'admin',
    password: 'admin123',
    region: '',
    comuna: '',
    direccion: '',
  },
  {
    run: '19011022K',
    nombre: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan@gmail.com',
    role: 'client',
    password: 'juan123',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Siempre Viva 123',
  },
  {
    run: '14567890K',
    nombre: 'María',
    apellidos: 'López',
    correo: 'maria@duoc.cl',
    role: 'client',
    password: 'maria123',
    region: 'Valparaíso',
    comuna: 'Viña del Mar',
    direccion: 'Calle Dulce 456',
  },
];

// Optional helpers
export const getProducts = () => productos.map(p => ({ ...p }));
export const getUsersSeed = () => seedUsers.map(u => ({ ...u }));

// LocalStorage keys
const USERS_KEY = 'users_v1';
const CURRENT_KEY = 'current_user_run_v1';

// Users: read/write with fallback to seed data
export function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return getUsersSeed();
    const parsed = JSON.parse(raw);
    // Ensure at least admin exists
    const hasAdmin = Array.isArray(parsed) && parsed.some(u => u && u.run === 'admin123');
    if (!hasAdmin) return getUsersSeed();
    return parsed;
  } catch {
    return getUsersSeed();
  }
}

export function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users || []));
}

export function readCurrentRun() {
  return localStorage.getItem(CURRENT_KEY) || null;
}

export function writeCurrentRun(run) {
  if (run) localStorage.setItem(CURRENT_KEY, run);
  else localStorage.removeItem(CURRENT_KEY);
}

// Cart helpers
export function cartKeyFor(run) {
  return `cart_${run || 'guest'}`;
}

export function readCart(run) {
  const key = cartKeyFor(run);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeCart(run, items) {
  const key = cartKeyFor(run);
  localStorage.setItem(key, JSON.stringify(items || []));
}
