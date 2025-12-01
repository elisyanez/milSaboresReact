import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useUbicaciones } from '../hooks/useUbicaciones';
import { validarRun, validarCorreoRegistro as validarCorreo } from '../utils/registro.logic';

export default function Registro() {
  const { register } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { regiones, getComunasByRegion, loading, error } = useUbicaciones();
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  useEffect(() => {
    if (form.region) {
      const comunas = getComunasByRegion(form.region);
      setComunasFiltradas(comunas);

      // Reset comuna si la región cambia
      if (!comunas.some(c => c.codigo === form.comuna)) {
        setForm(prev => ({ ...prev, comuna: '' }));
      }
    } else {
      setComunasFiltradas([]);
    }
  }, [form.region, getComunasByRegion]);

  if (loading) {
    return <div>Cargando ubicaciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.run) e.run = 'RUN es requerido';
    else if (!validarRun(form.run)) e.run = 'RUN inválido (sin puntos ni guion, con dígito verificador)';
    if (!form.nombre) e.nombre = 'Nombre requerido';
    else if (form.nombre.length > 50) e.nombre = 'Máx 50 caracteres';
    if (!form.apellidos) e.apellidos = 'Apellidos requeridos';
    else if (form.apellidos.length > 100) e.apellidos = 'Máx 100 caracteres';
    if (!form.correo) e.correo = 'Correo requerido';
    else if (!validarCorreo(form.correo)) e.correo = 'Correo inválido o dominio no permitido';
    if (!form.direccion) e.direccion = 'Dirección requerida';
    else if (form.direccion.length > 300) e.direccion = 'Máx 300 caracteres';
    if (!form.region) e.region = 'Seleccione una región';
    if (!form.comuna) e.comuna = 'Seleccione una comuna';
    if (!form.password) e.password = 'Contraseña requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      register({
        run: form.run.trim(),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        fechaNacimiento: form.fechaNacimiento,
        region: form.region,
        comuna: form.comuna,
        direccion: form.direccion.trim()
      }, form.password);
      alert('Usuario creado con éxito. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setErrors({ form: err.message || 'Error al registrar' });
    }
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Crear Cuenta</h2>
      <form onSubmit={onSubmit} className="form-card">
        {errors.form && <div className="form-error">{errors.form}</div>}
        <div className="form-grid">
          <label>
            RUN (sin puntos ni guion)
            <input name="run" value={form.run} onChange={onChange} placeholder="19011022K" />
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
            <input name="correo" value={form.correo} onChange={onChange} type="email" placeholder="usuario@duoc.cl" />
            {errors.correo && <span className="field-error">{errors.correo}</span>}
          </label>
          <label>
            Fecha Nacimiento (opcional)
            <input name="fechaNacimiento" value={form.fechaNacimiento} onChange={onChange} type="date" />
          </label>
          <label>
            Región
            <select 
              name="region" 
              value={form.region} 
              onChange={onChange}
            >
              <option value="">Seleccione región</option>
              {regiones.map(r => <option key={r.codigo} value={r.codigo}>{r.nombre}</option>)}
            </select>
            {errors.region && <span className="field-error">{errors.region}</span>}
          </label>
          <label>
            Comuna
            <select name="comuna" value={form.comuna} onChange={onChange} disabled={!form.region}>
              <option value="">Seleccione comuna</option>
              {comunasFiltradas.map(c => <option key={c.codigo} value={c.codigo}>{c.nombre}</option>)}
            </select>
            {errors.comuna && <span className="field-error">{errors.comuna}</span>}
          </label>
          <label className="wide">
            Dirección
            <input name="direccion" value={form.direccion} onChange={onChange} />
            {errors.direccion && <span className="field-error">{errors.direccion}</span>}
          </label>
          <label>
            Contraseña
            <input name="password" type="password" value={form.password} onChange={onChange} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Crear cuenta</button>
        </div>
      </form>
    </main>
  );
}
