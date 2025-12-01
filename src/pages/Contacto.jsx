import React, { useState } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [estado, setEstado] = useState({
    error: '',
    exito: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar mensajes al escribir
    setEstado({ error: '', exito: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { nombre, email, mensaje } = formData;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      setEstado({ error: 'Por favor completa todos los campos.', exito: '' });
      return;
    }

    // Validar email muy simple
    const emailValido = /\S+@\S+\.\S+/.test(email);
    if (!emailValido) {
      setEstado({ error: 'Ingresa un correo electrónico válido.', exito: '' });
      return;
    }

    // Simular envío
    console.log('Datos enviados:', formData);

    setEstado({
      error: '',
      exito: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
    });

    // Limpiar formulario
    setFormData({
      nombre: '',
      email: '',
      mensaje: '',
    });
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Contacto</h2>
      <p>Si tienes consultas o pedidos especiales, completa el formulario.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Cuéntanos en qué te podemos ayudar"
          />
        </div>

        {estado.error && <p className="form-message error">{estado.error}</p>}
        {estado.exito && <p className="form-message success">{estado.exito}</p>}

        <button type="submit" className="btn-enviar">
          Enviar mensaje
        </button>
      </form>
    </main>
  );
}
