import React, { useMemo, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useUbicaciones } from '../hooks/useUbicaciones';
import { validarCorreo as validarCorreoSimple } from '../utils/user.logic';

export default function Perfil() {
  const { currentUser, updateUser } = useUser();
  const { regiones, getComunasByRegion, loading, error } = useUbicaciones();
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
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  useEffect(() => {
    if (form.region) {
      const comunas = getComunasByRegion(form.region);
      setComunasFiltradas(comunas);
      if (!comunas.some((c) => c.codigo === form.comuna)) {
        setForm((prev) => ({ ...prev, comuna: '' }));
      }
    } else {
      setComunasFiltradas([]);
    }
  }, [form.region, form.comuna, getComunasByRegion]);

  const comunas = useMemo(() => {
    const r = regiones.find((r) => r.codigo === form.region);
    return r ? getComunasByRegion(r.codigo) : comunasFiltradas;
  }, [form.region, regiones, getComunasByRegion, comunasFiltradas]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'Requerido';
    if (!form.apellidos) e.apellidos = 'Requerido';
    if (!form.correo || !validarCorreoSimple(form.correo)) e.correo = 'Correo invalido';
    if (!form.direccion) e.direccion = 'Requerido';
    if (!form.region) e.region = 'Seleccione region';
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
      {error && <div className="form-error">{error}</div>}
      {loading && <p>Cargando ubicaciones...</p>}
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
            Region
            <select name="region" value={form.region} onChange={onChange}>
              <option value="">Seleccione region</option>
              {regiones.map((r) => (
                <option key={r.codigo} value={r.codigo}>
                  {r.nombre}
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
                <option key={c.codigo} value={c.codigo}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errors.comuna && <span className="field-error">{errors.comuna}</span>}
          </label>
          <label className="wide">
            Direccion
            <input name="direccion" value={form.direccion} onChange={onChange} />
            {errors.direccion && <span className="field-error">{errors.direccion}</span>}
          </label>
          <label>
            Nueva contrasena (opcional)
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
