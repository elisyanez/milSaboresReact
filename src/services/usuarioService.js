import axios from 'axios';
const API_BASE = 'http://localhost:8080/api/usuarios';

/*** Obtiene todos los productos desde el backend (GET)*/
export async function getUsuarios() {
    const res = await axios.get(API_BASE);
    return res.data;
}
/*** Crea un nuevo producto (POST)*/
export async function createUsuario(usuario) {
    const res = await axios.post(API_BASE, usuario);
    return res.data;
}
/*** Actualiza un producto existente (PUT)*/
export async function updateUsuario(run, usuario) {
    const res = await axios.put(`${API_BASE}/${run}`, usuario);
    return res.data;
}
/*** Elimina un producto por su ID (DELETE)*/
export async function deleteUsuario(run) {
    await axios.delete(`${API_BASE}/${run}`);
}