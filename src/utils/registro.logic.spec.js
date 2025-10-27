import { validarRun, validarCorreoRegistro } from './registro.logic.js';

describe('registro.logic', () => {
  it('validarRun acepta formatos válidos con DV', () => {
    expect(validarRun('111111111')).toBeTrue(); // 11111111 con DV=1
    expect(validarRun('11111111-1')).toBeFalse(); // guion no permitido
  });

  it('validarRun rechaza largos incorrectos', () => {
    expect(validarRun('123456')).toBeFalse();
    expect(validarRun('1234567890')).toBeFalse();
  });

  it('validarCorreoRegistro acepta dominios permitidos', () => {
    expect(validarCorreoRegistro('user@duoc.cl')).toBeTrue();
    expect(validarCorreoRegistro('user@profesor.duoc.cl')).toBeTrue();
    expect(validarCorreoRegistro('user@gmail.com')).toBeTrue();
  });

  it('validarCorreoRegistro rechaza inválidos', () => {
    expect(validarCorreoRegistro('bad@domain.com')).toBeFalse();
    expect(validarCorreoRegistro('bad example.com')).toBeFalse();
    expect(validarCorreoRegistro('')).toBeFalse();
  });
});
