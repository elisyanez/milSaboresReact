import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productoService';
import { formatCLP, parseCLP } from '../utils/money.logic';

// Fallback image (mismo que en Catálogo)
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220"><rect width="100%25" height="100%25" fill="%23FFF5E1"/><text x="50%25" y="44%25" dominant-baseline="middle" text-anchor="middle" fill="%235D4037" font-size="16" font-family="Lato, Arial">Imagen no disponible</text><text x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" fill="%23E58A2E" font-size="14" font-family="Lato, Arial">Dulce por venir</text></svg>';

// Categorías disponibles
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
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null); // 'NEW' o código
  const [form, setForm] = useState({
    codigo: '',
    categoria: '',
    nombre: '',
    precio: '',
    imagenUrl: '',
    visible: true
  });
  const [errors, setErrors] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductos();
        const mapped = Array.isArray(data)
          ? data.map(p => ({
              ...p,
              precio: formatCLP(Number(p.precio) || parseCLP(p.precio || 0)),
              visible: p.visible !== false
            }))
          : [];
        setProductos(mapped);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Error cargando productos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtrar productos por categoría
  const productosFiltrados = useMemo(() => {
    if (filtroCategoria === 'todas') return productos;
    return productos.filter(p => p.categoria === filtroCategoria);
  }, [productos, filtroCategoria]);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const iniciarCreacion = () => {
    setEditando('NEW');
    setForm({ codigo: '', categoria: '', nombre: '', precio: '', imagenUrl: '', visible: true });
    setErrors({});
  };

  const iniciarEdicion = (producto) => {
    setEditando(producto.codigo);
    setForm({
      codigo: producto.codigo,
      categoria: producto.categoria,
      nombre: producto.nombre,
      precio: String(Number(producto.precio) || parseCLP(producto.precio || 0)),
      imagenUrl: producto.imagenUrl,
      visible: producto.visible !== false
    });
    setErrors({});
  };

  const cancelar = () => {
    setEditando(null);
    setErrors({});
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
    if (!form.imagenUrl.trim()) nuevosErrores.imagenUrl = 'Imagen requerida';
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarProducto = async () => {
    if (!validarFormulario()) return;
    const precioNumber = Number(form.precio.replace(/\./g, '')) || 0;
    const payload = {
      codigo: form.codigo,
      categoria: form.categoria,
      nombre: form.nombre,
      precio: precioNumber,
      imagenUrl: form.imagenUrl,
      visible: form.visible
    };
    try {
      let saved;
      if (editando === 'NEW') {
        saved = await createProducto(payload);
      } else {
        saved = await updateProducto(editando, payload);
      }
      const normalizado = {
        ...saved,
        precio: formatCLP(Number(saved?.precio) || precioNumber),
        visible: saved?.visible !== false
      };
      setProductos(prev => (editando === 'NEW' ? [...prev, normalizado] : prev.map(p => (p.codigo === editando ? normalizado : p))));
      setEditando(null);
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Error guardando producto');
    }
  };

  const eliminarProducto = async (codigo) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await deleteProducto(codigo);
      setProductos(prev => prev.filter(p => p.codigo !== codigo));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Error al eliminar');
    }
  };

  const toggleVisibilidad = async (codigo) => {
    const prod = productos.find(p => p.codigo === codigo);
    if (!prod) return;
    try {
      const updated = await updateProducto(codigo, { ...prod, visible: !prod.visible, precio: Number(prod.precio) || parseCLP(prod.precio || 0) });
      setProductos(prev => prev.map(p =>
        p.codigo === codigo ? { ...p, ...updated, precio: formatCLP(Number(updated?.precio) || parseCLP(updated?.precio || 0)), visible: updated?.visible !== false } : p
      ));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'No se pudo actualizar visibilidad');
    }
  };

  const moverArriba = (index) => {
    if (index === 0) return;
    setProductos(prev => {
      const nuevos = [...prev];
      [nuevos[index], nuevos[index - 1]] = [nuevos[index - 1], nuevos[index]];
      return nuevos;
    });
  };

  const moverAbajo = (index) => {
    if (index === productosFiltrados.length - 1) return;
    setProductos(prev => {
      const nuevos = [...prev];
      [nuevos[index], nuevos[index + 1]] = [nuevos[index + 1], nuevos[index]];
      return nuevos;
    });
  };

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
    const productosCategoria = productos.filter(p => p.codigo.startsWith(prefijo));
    let numero = 1;
    while (productosCategoria.find(p => p.codigo === `${prefijo}${numero.toString().padStart(3, '0')}`)) {
      numero++;
    }
    setForm(prev => ({ ...prev, codigo: `${prefijo}${numero.toString().padStart(3, '0')}` }));
  };

  const manejarSubidaImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }
      if (archivo.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }
      const urlLocal = URL.createObjectURL(archivo);
      setForm(prev => ({
        ...prev,
        imagenUrl: urlLocal,
        archivoImagen: archivo
      }));
    }
  };

  return (
    <main className="page-container">
      <h2 className="page-title">Gestión de Productos</h2>
      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
      {loading && <p>Cargando productos...</p>}

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

      <div className="productos-grid">
        {productosFiltrados.map((prod, index) => (
          <div
            className={`producto-card ${!prod.visible ? 'producto-oculto' : ''}`}
            key={prod.codigo}
          >
            <div className="producto-img-wrap">
              <img
                src={prod.imagenUrl || PLACEHOLDER_IMG}
                alt={prod.nombre}
                className="producto-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMG;
                }}
              />
              <div className="producto-admin-overlay">
                <span className={`estado-visibilidad ${prod.visible ? 'visible' : 'oculto'}`}>
                  {prod.visible ? '✅ Visible' : '🚫 Oculto'}
                </span>
              </div>
            </div>

            <div className="producto-nombre">{prod.nombre}</div>
            <div className="producto-precio">{prod.precio}</div>
            <div className="producto-categoria">{prod.categoria}</div>

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
                  name="imagenUrl"
                  value={form.imagenUrl}
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
              {errors.imagenUrl && <span className="field-error">{errors.imagenUrl}</span>}
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

          {form.imagenUrl && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <p style={{ marginBottom: 8, color: 'var(--tabla-texto)' }}>Vista previa:</p>
              <img
                src={form.imagenUrl}
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

