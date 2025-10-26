import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const { login } = useUser();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    try {
      login(id, password);
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
          RUN o Correo
          <input value={id} onChange={(e)=> setId(e.target.value)} placeholder="19011022K o usuario@duoc.cl" />
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
