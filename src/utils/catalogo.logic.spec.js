import { sanitizeCantidad, buildDescripcion } from './catalogo.logic.js';

describe('catalogo.logic', () => {
  it('sanitizeCantidad floors and min=1', () => {
    expect(sanitizeCantidad('2.8')).toBe(2);
    expect(sanitizeCantidad(0)).toBe(1);
    expect(sanitizeCantidad(-5)).toBe(1);
    expect(sanitizeCantidad('abc')).toBe(1);
  });

  it('buildDescripcion uses mapa or falls back to categoria', () => {
    const mapa = { X: 'Descr X' };
    expect(buildDescripcion('X', 'Cat', mapa)).toBe('Descr X');
    expect(buildDescripcion('Y', 'Cat', mapa)).toBe('Cat');
  });
});

