// Utility functions extracted from AdminUsuarios

export function validarRunSimple(txt) {
  return !!txt && !/[.-]/.test(txt) && txt.length >= 7 && txt.length <= 9;
}

export function validarCorreo(email) {
  return /^[^\s@]+@([^\s@]+)$/.test((email || '').trim());
}

