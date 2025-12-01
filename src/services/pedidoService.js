import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/pedidos';

axios.defaults.withCredentials = true;

export async function getPedidos() {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
}

export async function getPedidosByUsuario(run) {
  const res = await axios.get(`${API_BASE}/usuario/${run}`, { withCredentials: true });
  return res.data;
}

export async function getPedidoById(id) {
  const res = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
  return res.data;
}

export async function createPedido(payload) {
  const res = await axios.post(API_BASE, payload, { withCredentials: true });
  return res.data;
}

export async function updateEstadoPedido(id, estado) {
  const res = await axios.put(`${API_BASE}/${id}/estado`, { estado }, { withCredentials: true });
  return res.data;
}
