import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/productos';

export async function getProductos() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
}

export async function createProducto(producto) {
  const res = await axios.post(API_BASE, producto, { withCredentials: true });
  return res.data;
}

export async function updateProducto(codigo, producto) {
  const res = await axios.put(`${API_BASE}/${codigo}`, producto, { withCredentials: true });
  return res.data;
}

export async function deleteProducto(codigo) {
  await axios.delete(`${API_BASE}/${codigo}`, { withCredentials: true });
}
