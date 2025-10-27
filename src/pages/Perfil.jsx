import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { regiones } from '../data/regionesComunas';
import { validarCorreo as validarCorreoSimple } from '../utils/user.logic';

export default function Perfil() {
  const { currentUser, updateUser } = useUser();
  const [form, setForm] = useState(() => ({
    nombre: currentUser?.nombre || '',
    apellidos: currentUser?.apellidos || '',
    correo: currentUser?.correo || '',
    region: currentUser?.region || '',
    comuna: currentUser?.comuna || '',
    direccion: currentUser?.direccion || '',
    password: ''
  }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Do not early-return before hooks; render conditionally instead

  const comunas = useMemo(() => {
    const r = regiones.find((r) => r.region === form.region);
    return r ? r.comunas : [];
  }, [form.region]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'Requerido';
    if (!form.apellidos) e.apellidos = 'Requerido';
    if (!form.correo || !validarCorreoSimple(form.correo)) e.correo = 'Correo inválido';
    if (!form.direccion) e.direccion = 'Requerido';
    if (!form.region) e.region = 'Seleccione región';
    if (!form.comuna) e.comuna = 'Seleccione comuna';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    const patch = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    };
    if (form.password) patch.password = form.password;
    updateUser(currentUser.run, patch);
    setSaved(true);
  };

  return !currentUser ? (
    <Navigate to="/login" replace />
  ) : (
    <main className="page-container">
      <h2 className="page-title">Mi Perfil</h2>
      <form className="form-card" onSubmit={save}>
        {saved && <div className="form-success">Datos actualizados</div>}
        <div className="form-grid">
          <label>
            Nombres
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
            <input name="correo" value={form.correo} onChange={onChange} type="email" />
            {errors.correo && <span className="field-error">{errors.correo}</span>}
          </label>
          <label>
            Región
            <select name="region" value={form.region} onChange={onChange}>
              <option value="">Seleccione región</option>
              {regiones.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region}
                </option>
              ))}
            </select>
            {errors.region && <span className="field-error">{errors.region}</span>}
          </label>
          <label>
            Comuna
            <select name="comuna" value={form.comuna} onChange={onChange} disabled={!form.region}>
              <option value="">Seleccione comuna</option>
              {comunas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.comuna && <span className="field-error">{errors.comuna}</span>}
          </label>
          <label className="wide">
            Dirección
            <input name="direccion" value={form.direccion} onChange={onChange} />
            {errors.direccion && <span className="field-error">{errors.direccion}</span>}
          </label>
          <label>
            Nueva contraseña (opcional)
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </label>
        </div>
        <div className="form-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" type="submit">Guardar cambios</button>
        </div>
      </form>
    </main>
  );
}
