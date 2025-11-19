import React, { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { productos as productosIniciales } from '../data/db';

// Fallback image (mismo que en Catálogo)
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220"><rect width="100%25" height="100%25" fill="%23FFF5E1"/><text x="50%25" y="44%25" dominant-baseline="middle" text-anchor="middle" fill="%235D4037" font-size="16" font-family="Lato, Arial">Imagen no disponible</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%23E58A2E" font-size="14" font-family="Lato, Arial">Dulce por venir</text></svg>';

// Categorías disponibles basadas en tus productos
const CATEGORIAS = [
  'Tortas Cuadradas',
  'Tortas Circulares', 
  'Postres Individuales',
  'Productos Sin Azúcar',
  'Pastelería Tradicional',
  'Productos Sin Gluten',
  'Productos Veganos',
  'Tortas Especiales'
];

export default function GestionProductos() {
  const { currentUser } = useUser();
  const [productos, setProductos] = useState(productosIniciales);
  const [editando, setEditando] = useState(null); // 'NEW' o codigo del producto
  const [form, setForm] = useState({
    codigo: '',
    categoria: '',
    nombre: '',
    precio: '',
    img: '',
    visible: true
  });
  const [errors, setErrors] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  // Filtrar productos por categoría - HOOKS SIEMPRE ARRIBA
  const productosFiltrados = useMemo(() => {
    if (filtroCategoria === 'todas') return productos;
    return productos.filter(p => p.categoria === filtroCategoria);
  }, [productos, filtroCategoria]);

  // Verificar permisos de admin - DESPUÉS DE TODOS LOS HOOKS
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Iniciar creación de producto
  const iniciarCreacion = () => {
    setEditando('NEW');
    setForm({
      codigo: '',
      categoria: '',
      nombre: '',
      precio: '',
      img: '',
      visible: true
    });
    setErrors({});
  };

  // Iniciar edición de producto
  const iniciarEdicion = (producto) => {
    setEditando(producto.codigo);
    setForm({
      codigo: producto.codigo,
      categoria: producto.categoria,
      nombre: producto.nombre,
      precio: producto.precio.replace(' CLP', '').replace('$', ''),
      img: producto.img,
      visible: producto.visible !== false // Por defecto visible
    });
    setErrors({});
  };

  // Cancelar edición
  const cancelar = () => {
    setEditando(null);
    setErrors({});
  };

  // Manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!form.codigo.trim()) {
      nuevosErrores.codigo = 'Código requerido';
    } else if (editando === 'NEW' && productos.find(p => p.codigo === form.codigo)) {
      nuevosErrores.codigo = 'El código ya existe';
    }

    if (!form.categoria) nuevosErrores.categoria = 'Categoría requerida';
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
    
    if (!form.precio.trim()) {
      nuevosErrores.precio = 'Precio requerido';
    } else if (!/^\d+$/.test(form.precio.replace(/\./g, ''))) {
      nuevosErrores.precio = 'Precio inválido (solo números, ej: 45000)';
    }

    if (!form.img.trim()) nuevosErrores.img = 'Imagen requerida';

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar producto (crear o actualizar)
  // Guardar producto (crear o actualizar)
const guardarProducto = async () => {
  if (!validarFormulario()) return;

  let rutaImagenFinal = form.img;

  // Si hay una imagen local para subir
  if (form.archivoImagen) {
    try {
      // Mostrar loading
      console.log('Subiendo imagen...');
      
      // Subir imagen al servidor
      rutaImagenFinal = await subirImagenAlServidor(form.archivoImagen);
      
      console.log('Imagen subida exitosamente:', rutaImagenFinal);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
      return;
    }
  }

  const productoData = {
    codigo: form.codigo,
    categoria: form.categoria,
    nombre: form.nombre,
    precio: `$${parseInt(form.precio).toLocaleString('es-CL')} CLP`,
    img: rutaImagenFinal,
    visible: form.visible
  };

  if (editando === 'NEW') {
    setProductos(prev => [...prev, productoData]);
  } else {
    setProductos(prev => prev.map(p => 
      p.codigo === editando ? productoData : p
    ));
  }

  setEditando(null);
};

  // Eliminar producto
  const eliminarProducto = (codigo) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.codigo !== codigo));
    }
  };

  // Toggle visibilidad
  const toggleVisibilidad = (codigo) => {
    setProductos(prev => prev.map(p => 
      p.codigo === codigo ? { ...p, visible: !p.visible } : p
    ));
  };

  // Reordenar productos (mover arriba)
  const moverArriba = (index) => {
    if (index === 0) return;
    setProductos(prev => {
      const nuevos = [...prev];
      [nuevos[index], nuevos[index - 1]] = [nuevos[index - 1], nuevos[index]];
      return nuevos;
    });
  };

  // Reordenar productos (mover abajo)
  const moverAbajo = (index) => {
    if (index === productosFiltrados.length - 1) return;
    setProductos(prev => {
      const nuevos = [...prev];
      [nuevos[index], nuevos[index + 1]] = [nuevos[index + 1], nuevos[index]];
      return nuevos;
    });
  };

  // Generar código automático para nuevo producto
  const generarCodigoAutomatico = () => {
    const categoriasCodigos = {
        'Tortas Cuadradas': 'TC',
        'Tortas Circulares': 'TT',
        'Postres Individuales': 'PI',
        'Productos Sin Azúcar': 'PSA',
        'Pastelería Tradicional': 'PT',
        'Productos Sin Gluten': 'PG',
        'Productos Veganos': 'PV',
        'Tortas Especiales': 'TE'
    };

    const prefijo = categoriasCodigos[form.categoria] || 'PR';

    // Encontrar el siguiente número disponible en esta categoría
    const productosCategoria = productos.filter(p => 
        p.codigo.startsWith(prefijo)
    );
    
    let numero = 1;
    while (productosCategoria.find(p => p.codigo === `${prefijo}${numero.toString().padStart(3, '0')}`)) {
        numero++;
    }
    const nuevoCodigo = `${prefijo}${numero.toString().padStart(3, '0')}`;
    setForm(prev => ({ ...prev, codigo: nuevoCodigo }));
    };

// Función para manejar subida de imagen local
const manejarSubidaImagen = (e) => {
  const archivo = e.target.files[0];
  if (archivo) {
    // Validar tipo de archivo
    if (!archivo.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    // Validar tamaño (max 2MB)
    if (archivo.size > 2 * 1024 * 1024) {
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    // Crear URL local para vista previa inmediata
    const urlLocal = URL.createObjectURL(archivo);
    setForm(prev => ({ 
      ...prev, 
      img: urlLocal,
      archivoImagen: archivo // Guardamos el archivo para luego subirlo
    }));
  }
};

// Función para subir imagen al servidor (simulada por ahora)
const subirImagenAlServidor = async (archivo) => {
  // En un entorno real, aquí harías una petición a tu backend
  // Por ahora simulamos la subida copiando a public/IMG/
  
  return new Promise((resolve, reject) => {
    // Simulamos un delay de subida
    setTimeout(() => {
      try {
        // Generar nombre único para la imagen
        const extension = archivo.name.split('.').pop();
        const nombreUnico = `producto_${Date.now()}.${extension}`;
        const rutaServidor = `/IMG/${nombreUnico}`;
        
        // En un entorno real, aquí subirías el archivo
        console.log('Subiendo imagen:', archivo.name, '→', rutaServidor);
        
        // Por ahora, solo retornamos la ruta que debería tener
        resolve(rutaServidor);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

  return (
    <main className="page-container">
      <h2 className="page-title">Gestión de Productos</h2>

      {/* Filtros */}
      <div className="form-card" style={{ maxWidth: 1100 }}>
        <div className="form-actions" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
          <button 
            type="button" 
            className={`btn ${filtroCategoria === 'todas' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroCategoria('todas')}
          >
            Todas las categorías
          </button>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              type="button"
              className={`btn ${filtroCategoria === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFiltroCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos - estilo similar a Catálogo pero con controles admin */}
      <div className="productos-grid">
        {productosFiltrados.map((prod, index) => (
          <div 
            className={`producto-card ${!prod.visible ? 'producto-oculto' : ''}`} 
            key={prod.codigo}
          >
            <div className="producto-img-wrap">
              <img 
                src={prod.img} 
                alt={prod.nombre} 
                className="producto-img" 
                onError={(e) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }} 
              />
              <div className="producto-admin-overlay">
                <span className={`estado-visibilidad ${prod.visible ? 'visible' : 'oculto'}`}>
                  {prod.visible ? '🟢 Visible' : '🔴 Oculto'}
                </span>
              </div>
            </div>
            
            <div className="producto-nombre">{prod.nombre}</div>
            <div className="producto-precio">{prod.precio}</div>
            <div className="producto-categoria">{prod.categoria}</div>
            
            {/* Controles de administración */}
            <div className="producto-controles">
              <div className="controles-superiores">
                <button 
                  className="btn btn-secondary btn-xs"
                  onClick={() => iniciarEdicion(prod)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-outline-danger btn-xs"
                  onClick={() => eliminarProducto(prod.codigo)}
                >
                  Eliminar
                </button>
              </div>
              
              <div className="controles-inferiores">
                <button 
                  className="btn btn-xs"
                  onClick={() => toggleVisibilidad(prod.codigo)}
                  style={{ 
                    background: prod.visible ? '#e58a2e' : '#7eb6e6',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {prod.visible ? 'Ocultar' : 'Mostrar'}
                </button>
                
                <div className="controles-reordenar">
                  <button 
                    className="btn-mover"
                    onClick={() => moverArriba(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    className="btn-mover"
                    onClick={() => moverAbajo(index)}
                    disabled={index === productosFiltrados.length - 1}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de edición/creación */}
      {editando && (
        <div className="form-card" style={{ marginTop: 20, maxWidth: 600 }}>
          <h3 style={{ marginTop: 0, color: 'var(--tabla-texto)' }}>
            {editando === 'NEW' ? 'Crear Nuevo Producto' : `Editar Producto: ${form.codigo}`}
          </h3>
          
          <div className="form-grid">
            <label>
              Código del Producto
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={manejarCambio}
                disabled={editando !== 'NEW'}
                className="input-pastel"
                placeholder="Ej: TC003, PI003"
                style={{ flex: 1 }}
              />
              {editando === 'NEW' && (
                <button 
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={generarCodigoAutomatico}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    Auto
                </button>
                )}
              </div>
              <small style={{ color: '#666', fontSize: '12px' }}>
                    Ejemplo: TC001 (Tortas Cuadradas), PI001 (Postres Individuales)
              </small>
              {errors.codigo && <span className="field-error">{errors.codigo}</span>}
            </label>

            <label>
              Categoría
              <select 
                name="categoria" 
                value={form.categoria} 
                onChange={manejarCambio}
                className="input-pastel"
              >
                <option value="">Seleccione categoría</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && <span className="field-error">{errors.categoria}</span>}
            </label>

            <label className="wide">
              Nombre del Producto
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={manejarCambio}
                className="input-pastel"
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </label>

            <label>
              Precio (CLP)
              <input
                type="text"
                name="precio"
                value={form.precio}
                onChange={manejarCambio}
                placeholder="45000"
                className="input-pastel"
              />
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </label>

            <label className="wide">
                Imagen del Producto
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <input
                    type="text"
                    name="img"
                    value={form.img}
                    onChange={manejarCambio}
                    placeholder="URL de la imagen: /IMG/torta-ejemplo.jpg"
                    className="input-pastel"
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>O</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={manejarSubidaImagen}
                        style={{ flex: 1 }}
                    />
                    </div>
                </div>
                {errors.img && <span className="field-error">{errors.img}</span>}
                </label>

            <label style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                name="visible"
                checked={form.visible}
                onChange={manejarCambio}
              />
              Producto visible en el catálogo
            </label>
          </div>

          {/* Vista previa de la imagen */}
          {form.img && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <p style={{ marginBottom: 8, color: 'var(--tabla-texto)' }}>Vista previa:</p>
              <img 
                src={form.img} 
                alt="Vista previa" 
                style={{ 
                  maxWidth: 200, 
                  maxHeight: 150, 
                  borderRadius: 8,
                  border: '2px solid var(--tabla-naranja)'
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={cancelar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={guardarProducto}>
              {editando === 'NEW' ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Botones de acción principales */}
      <div className="form-actions" style={{ marginTop: 20, justifyContent: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={iniciarCreacion}>
          + Nuevo Producto
        </button>
        <Link className="btn btn-secondary" to="/">
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}