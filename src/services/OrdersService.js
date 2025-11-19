// Local orders service. Replace implementations with Spring Boot API calls later.
const ORDERS_KEY = 'orders_v1';

function load() {
  try { const raw = localStorage.getItem(ORDERS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function save(list) { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); }

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function genNumero() {
  const seq = Date.now().toString().slice(-8);
  return `CMS-${seq}`; // CienMilSabores
}

export const ESTADOS = ['PENDIENTE','CONFIRMADO','EN_PREPARACION','DESPACHADO','ENTREGADO','CANCELADO'];

export const OrdersService = {
  genNumero,
  create(draft) {
    const list = load();
    const order = {
      id: genId(),
      numero: genNumero(),
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
      ...draft,
    };
    list.push(order);
    save(list);
    return order;
  },
  getById(id) {
    return load().find(o => o.id === id) || null;
  },
  listAll() { return load().sort((a,b)=> (b.fecha||'').localeCompare(a.fecha||'')); },
  listMine(run) { return load().filter(o => o.usuarioRun === run).sort((a,b)=> (b.fecha||'').localeCompare(a.fecha||'')); },
  updateEstado(id, estado) {
    const list = load();
    const i = list.findIndex(o => o.id === id);
    if (i>=0) { list[i] = { ...list[i], estado }; save(list); return list[i]; }
    return null;
  }
};

