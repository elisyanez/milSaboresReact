import { ensureAdminSeed, registerUser, loginFind, updateUserInList, deleteUserFromList } from './userContext.logic.js';

describe('userContext.logic', () => {
  it('ensureAdminSeed adds default admin when missing', () => {
    const out = ensureAdminSeed([]);
    expect(out.some(u => u.run === 'admin123' && u.role === 'admin')).toBeTrue();
  });

  it('registerUser adds and prevents duplicates', () => {
    const base = [];
    const user = { run: '1', nombre: 'N', apellidos: 'A', correo: 'n@x', region: '', comuna: '', direccion: '' };
    const out = registerUser(base, user, 'p', 'client');
    expect(out.find(u => u.run === '1')).toBeTruthy();
    expect(() => registerUser(out, user, 'p', 'client')).toThrow();
  });

  it('loginFind returns user or throws', () => {
    const list = [{ run: '1', correo: 'n@x', password: 'p' }];
    expect(loginFind(list, '1', 'p').run).toBe('1');
    expect(() => loginFind(list, 'no', 'p')).toThrow();
    expect(() => loginFind(list, '1', 'bad')).toThrow();
  });

  it('updateUserInList updates matching', () => {
    const list = [{ run: '1', nombre: 'N' }];
    const out = updateUserInList(list, '1', { nombre: 'X' });
    expect(out.find(u => u.run === '1').nombre).toBe('X');
  });

  it('deleteUserFromList removes matching', () => {
    const list = [{ run: '1' }, { run: '2' }];
    const out = deleteUserFromList(list, '1');
    expect(out.some(u => u.run === '1')).toBeFalse();
  });
});

