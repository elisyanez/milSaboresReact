import { validarRunSimple, validarCorreo } from './user.logic.js';

describe('user.logic', () => {
  describe('validarRunSimple', () => {
    it('accepts 7-9 chars without dots or dashes', () => {
      expect(validarRunSimple('1234567')).toBeTrue();
      expect(validarRunSimple('12345678')).toBeTrue();
      expect(validarRunSimple('123456789')).toBeTrue();
    });

    it('rejects with dots, dashes or wrong length', () => {
      expect(validarRunSimple('12.345.678')).toBeFalse();
      expect(validarRunSimple('123456-7')).toBeFalse();
      expect(validarRunSimple('123456')).toBeFalse();
      expect(validarRunSimple('1234567890')).toBeFalse();
    });
  });

  describe('validarCorreo', () => {
    it('accepts simple email format', () => {
      expect(validarCorreo('user@example.com')).toBeTrue();
      expect(validarCorreo('u@subdomain')).toBeTrue();
    });

    it('trims spaces and rejects invalid', () => {
      expect(validarCorreo('   ')).toBeFalse();
      expect(validarCorreo('bad@')).toBeFalse();
      expect(validarCorreo('bad example.com')).toBeFalse();
    });
  });
});

