// Validations for Registro page

export function validarRun(runRaw) {
  if (!runRaw) return false;
  const txt = String(runRaw).trim();
  if (/[-.]/.test(txt)) return false; // no dots or dash
  if (txt.length < 7 || txt.length > 9) return false;
  if (!/^[0-9]+[0-9Kk]$/.test(txt)) return false;
  const cuerpo = txt.slice(0, -1);
  const dv = txt.slice(-1).toUpperCase();
  let suma = 0,
    multip = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multip;
    multip = multip === 7 ? 2 : multip + 1;
  }
  const res = 11 - (suma % 11);
  const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvCalc;
}

export function validarCorreoRegistro(email) {
  if (!email) return false;
  const txt = String(email).trim().toLowerCase();
  if (txt.length > 100) return false;
  if (!/^[^\s@]+@([^\s@]+)$/.test(txt)) return false;
  return /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(txt);
}

