import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useUbicaciones } from '../hooks/useUbicaciones';
import { validarRunSimple, validarCorreo } from '../utils/user.logic';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuarioService';

export default function AdminUsuarios({ onEdit }) {
  const { currentUser } = useUser();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { regiones, getComunasByRegion } = useUbicaciones();
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [editing, setEditing] = useState(null); // run
  const [form, setForm] = useState({ run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', role: 'client', password: '' });
  const [errors, setErrors] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (run) => {
    if (!window.confirm('?Seguro que quiere eliminar al usuario?')) return;
    try {
      await deleteUsuario(run);
      setUsuarios(prev => prev.filter(u => u.run !== run));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Error al eliminar');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const startCreate = () => {
    setEditing('NEW');
    setForm({ run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', role: 'client', password: '' });
    setErrors({});
    setComunasFiltradas([]);
  };

  const startEdit = (u) => {
    setEditing(u.run);
    setForm({
      run: u.run,
      nombre: u.nombre || '',
      apellidos: u.apellidos || '',
      correo: u.correo || '',
      region: u.region || '',
      comuna: u.comuna || '',
      direccion: u.direccion || '',
      role: u.role || 'client',
      password: ''
    });
    if (u.region) {
      const comunas = getComunasByRegion(u.region);
      setComunasFiltradas(comunas);
    } else {
      setComunasFiltradas([]);
    }
    setErrors({});
  };

  const handleRegionChange = (regionCodigo) => {
    setForm(prev => ({
      ...prev,
      region: regionCodigo,
      comuna: ''
    }));

    if (regionCodigo) {
      const comunas = getComunasByRegion(regionCodigo);
      setComunasFiltradas(comunas);
    } else {
      setComunasFiltradas([]);
    }
  };

  const cancel = () => { setEditing(null); setErrors({}); };
  const onChange = (e) => { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); };

  const validate = (isNew) => {
    const e = {};
    if (isNew) { if (!validarRunSimple(form.run)) e.run = 'RUN inv?lido'; }
    if (!form.nombre) e.nombre = 'Requerido';
    if (!form.apellidos) e.apellidos = 'Requerido';
    if (!form.correo || !validarCorreo(form.correo)) e.correo = 'Correo inv?lido';
    if (!form.direccion) e.direccion = 'Requerido';
    if (!form.region) e.region = 'Seleccione regi?n';
    if (!form.comuna) e.comuna = 'Seleccione comuna';
    if (isNew && !form.password) e.password = 'Requerida';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const save = async () => {
    const isNew = editing === 'NEW';
    if (!validate(isNew)) return;
    const payload = {
      run: form.run.trim(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
      role: form.role,
    };
    if (form.password) payload.password = form.password;
    try {
      if (isNew) {
        const created = await createUsuario(payload);
        setUsuarios(prev => [...prev, created]);
      } else {
        const updated = await updateUsuario(form.run, payload);
        setUsuarios(prev => prev.map(u => u.run === form.run ? updated : u));
      }
      setEditing(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al guardar usuario');
    }
  };

  const confirmDelete = (run) => {
    if (window.confirm('?Eliminar este usuario?')) handleDelete(run);
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Gesti?n de Usuarios</h2>

      <div className="form-card" style={{ overflowX: 'auto', maxWidth: 'none', width: '100%' }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Regi?n</th>
              <th>Comuna</th>
              <th>Direcci?n</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombre}</td>
                <td>{u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.region}</td>
                <td>{u.comuna}</td>
                <td>{u.direccion}</td>
                <td><span className="meta-chip">{u.role}</span></td>
                <td className="actions-cell">
                  <button className="btn btn-secondary btn-xs" onClick={() => startEdit(u)}>Editar</button>
                  {u.run !== 'admin123' && (
                    <button className="btn btn-outline-danger btn-xs" onClick={() => confirmDelete(u.run)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="form-card" style={{ marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>{editing === 'NEW' ? 'Crear usuario' : `Editar usuario: ${form.run}`}</h3>
          <div className="form-grid">
            <label>
              RUN
              <input name="run" value={form.run} onChange={onChange} disabled={editing !== 'NEW'} />
              {errors.run && <span className="field-error">{errors.run}</span>}
            </label>
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={onChange} />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </label>
            <label>
              Apellidos
              <input name="apellidos" value={form.apellidos} onChange={onChange} />
              {errors.apellidos && <span className="field-error">{errors.apellidos}</span>}
            </label>
            <label>
              Correo
              <input name="correo" value={form.correo} onChange={onChange} />
              {errors.correo && <span className="field-error">{errors.correo}</span>}
            </label>
            <label>
              Regi?n
              <select
                name="region"
                value={form.region}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                <option value="">Seleccione regi?n</option>
                {regiones.map(region => (
                  <option key={region.codigo} value={region.codigo}>
                    {region.nombre}
                  </option>
                ))}
              </select>
              {errors.region && <span className="field-error">{errors.region}</span>}
            </label>
            <label>
              Comuna
              <select
                name="comuna"
                value={form.comuna}
                onChange={onChange}
                disabled={!form.region}
              >
                <option value="">Seleccione comuna</option>
                {comunasFiltradas.map(comuna => (
                  <option key={comuna.codigo} value={comuna.codigo}>
                    {comuna.nombre}
                  </option>
                ))}
              </select>
              {errors.comuna && <span className="field-error">{errors.comuna}</span>}
            </label>
            <label className="wide">
              Direcci?n
              <input name="direccion" value={form.direccion} onChange={onChange} />
              {errors.direccion && <span className="field-error">{errors.direccion}</span>}
            </label>
            <label>
              Rol
              <select name="role" value={form.role} onChange={onChange}>
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <label>
              Contrase?a {editing !== 'NEW' && <small>(d?jela vac?a para no cambiar)</small>}
              <input name="password" type="password" value={form.password} onChange={onChange} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={cancel}>Cancelar</button>
            <button className="btn btn-primary" onClick={save}>Guardar</button>
          </div>
        </div>
      )}
      <div className="form-actions" style={{ marginTop: 12, justifyContent: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={startCreate}>Nuevo usuario</button>
        <Link className="btn btn-secondary" to="/">Volver al inicio</Link>
      </div>
    </main>
  );
}
