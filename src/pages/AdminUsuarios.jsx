import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { regiones } from '../data/regionesComunas';

function validarRunSimple(txt){ return !!txt && !/[.-]/.test(txt) && txt.length>=7 && txt.length<=9; }
function validarCorreo(email){ return /^[^\s@]+@([^\s@]+)$/.test((email||'').trim()); }

export default function AdminUsuarios(){
  const { users, currentUser, register, updateUser, deleteUser } = useUser();
  const [editing, setEditing] = useState(null); // run
  const [form, setForm] = useState({ run:'', nombre:'', apellidos:'', correo:'', region:'', comuna:'', direccion:'', role:'client', password:'' });
  const [errors, setErrors] = useState({});

  const comunas = useMemo(()=>{
    const r = regiones.find(r=> r.region === form.region); return r? r.comunas : [];
  },[form.region]);

  if (!currentUser || currentUser.role !== 'admin'){
    return <Navigate to="/login" replace />;
  }

  const startCreate = () => { setEditing('NEW'); setForm({ run:'', nombre:'', apellidos:'', correo:'', region:'', comuna:'', direccion:'', role:'client', password:'' }); setErrors({}); };
  const startEdit = (u) => { setEditing(u.run); setForm({ run: u.run, nombre:u.nombre||'', apellidos:u.apellidos||'', correo:u.correo||'', region:u.region||'', comuna:u.comuna||'', direccion:u.direccion||'', role:u.role||'client', password:u.password||'' }); setErrors({}); };
  const cancel = ()=> { setEditing(null); setErrors({}); };
  const onChange = (e)=> { const {name,value} = e.target; setForm(f=> ({...f, [name]: value})); };

  const validate = (isNew) => {
    const e={};
    if (isNew){ if (!validarRunSimple(form.run)) e.run='RUN inválido'; }
    if (!form.nombre) e.nombre='Requerido';
    if (!form.apellidos) e.apellidos='Requerido';
    if (!form.correo || !validarCorreo(form.correo)) e.correo='Correo inválido';
    if (!form.direccion) e.direccion='Requerido';
    if (!form.region) e.region='Seleccione región';
    if (!form.comuna) e.comuna='Seleccione comuna';
    if (isNew && !form.password) e.password='Requerida';
    setErrors(e); return Object.keys(e).length===0;
  };

  const save = () => {
    const isNew = editing==='NEW';
    if (!validate(isNew)) return;
    if (isNew){
      register({ run: form.run.trim(), nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim(), region: form.region, comuna: form.comuna, direccion: form.direccion.trim() }, form.password, form.role);
    } else {
      const patch = { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim(), region: form.region, comuna: form.comuna, direccion: form.direccion.trim(), role: form.role };
      if (form.password) patch.password = form.password;
      updateUser(form.run, patch);
    }
    setEditing(null);
  };

  const confirmDelete = (run) => {
    if (window.confirm('¿Eliminar este usuario?')) deleteUser(run);
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Gestión de Usuarios</h2>

      <div className="form-card" style={{ overflowX:'auto', maxWidth: 'none', width: '100%' }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>RUN</th><th>Nombre</th><th>Apellidos</th><th>Correo</th><th>Región</th><th>Comuna</th><th>Dirección</th><th>Rol</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
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
                  <button className="btn btn-secondary btn-xs" onClick={()=> startEdit(u)}>Editar</button>
                  {u.run !== 'admin123' && (
                    <button className="btn btn-outline-danger btn-xs" onClick={()=> confirmDelete(u.run)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="form-card" style={{marginTop: 12}}>
          <h3 style={{marginTop:0}}>{editing==='NEW' ? 'Crear usuario' : `Editar usuario: ${form.run}`}</h3>
          <div className="form-grid">
            <label>
              RUN
              <input name="run" value={form.run} onChange={onChange} disabled={editing!=='NEW'} />
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
              Región
              <select name="region" value={form.region} onChange={onChange}>
                <option value="">Seleccione región</option>
                {regiones.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
              </select>
              {errors.region && <span className="field-error">{errors.region}</span>}
            </label>
            <label>
              Comuna
              <select name="comuna" value={form.comuna} onChange={onChange} disabled={!form.region}>
                <option value="">Seleccione comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.comuna && <span className="field-error">{errors.comuna}</span>}
            </label>
            <label className="wide">
              Dirección
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
              Contraseña {editing!=='NEW' && <small>(déjela vacía para no cambiar)</small>}
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
