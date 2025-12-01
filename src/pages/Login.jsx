import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const { login } = useUser();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(correo, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    }
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Iniciar Sesion</h2>
      <form onSubmit={onSubmit} className="form-card login-form">
        {error && <div className="form-error">{error}</div>}
        <label>
          Correo
          <input value={correo} onChange={(e)=> setCorreo(e.target.value)} placeholder="usuario@duoc.cl" type="email" />
        </label>
        <label>
          Contrasena
          <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
        </label>
        <div className="form-actions" style={{ justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" type="submit">Iniciar Sesion</button>
          <div className="create-account" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: 'rgba(93,64,55,0.85)' }}>¿No tienes cuenta? </span>
          <Link to="/registro" className="btn btn-outline-secondary">Crear cuenta</Link>
        </div></div>
      </form>
    </main>
  );
}
