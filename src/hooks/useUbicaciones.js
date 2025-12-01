import { useState, useEffect } from 'react';
import { ubicacionService } from '../services/ubicacionService';

export const useUbicaciones = () => {
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comunasPorRegion, setComunasPorRegion] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar regiones y comunas al montar el componente
  useEffect(() => {
    cargarUbicaciones();
  }, []);

  const cargarUbicaciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar en paralelo
      const [regionesData, comunasData] = await Promise.all([
        ubicacionService.getRegiones(),
        ubicacionService.getComunas()
      ]);

      setRegiones(regionesData);
      setComunas(comunasData);

      // Pre-procesar comunas por región para búsquedas rápidas
      const comunasPorRegionMap = {};
      comunasData.forEach(comuna => {
        if (!comunasPorRegionMap[comuna.regionCodigo]) {
          comunasPorRegionMap[comuna.regionCodigo] = [];
        }
        comunasPorRegionMap[comuna.regionCodigo].push(comuna);
      });
      setComunasPorRegion(comunasPorRegionMap);

    } catch (err) {
      setError('Error al cargar ubicaciones');
      console.error('Error loading ubicaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener comunas filtradas por región
  const getComunasByRegion = (regionCodigo) => {
    return comunasPorRegion[regionCodigo] || [];
  };

  // Buscar región por código
  const getRegionByCodigo = (codigo) => {
    return regiones.find(region => region.codigo === codigo);
  };

  // Buscar comuna por código
  const getComunaByCodigo = (codigo) => {
    return comunas.find(comuna => comuna.codigo === codigo);
  };

  return {
    regiones,
    comunas,
    getComunasByRegion,
    getRegionByCodigo,
    getComunaByCodigo,
    loading,
    error,
    refetch: cargarUbicaciones
  };
};