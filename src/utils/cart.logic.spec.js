import { groupItems, updateQuantityInList, removeQuantityInList, countItems, totalFromGrouped } from './cart.logic.js';
import { parseCLP } from './money.logic.js';

describe('cart.logic', () => {
  const items = [
    { codigo: 'A', nombre: 'A', precio: '$1.000', img: '', cantidad: 1 },
    { codigo: 'A', nombre: 'A', precio: '$1.000', img: '', cantidad: 2 },
    { codigo: 'B', nombre: 'B', precio: '$2.000', img: '', cantidad: 1 },
  ];

  it('groupItems combines quantities by codigo', () => {
    const g = groupItems(items);
    const a = g.find(x => x.codigo === 'A');
    const b = g.find(x => x.codigo === 'B');
    expect(a.cantidad).toBe(3);
    expect(b.cantidad).toBe(1);
  });

  it('updateQuantityInList sets absolute qty or removes when 0', () => {
    const updated = updateQuantityInList(items, 'B', 5);
    expect(updated.some(x => x.codigo === 'B')).toBeTrue();
    const g = groupItems(updated);
    expect(g.find(x => x.codigo === 'B').cantidad).toBe(5);

    const removed = updateQuantityInList(items, 'B', 0);
    expect(removed.some(x => x.codigo === 'B')).toBeFalse();
  });

  it('removeQuantityInList subtracts and removes if reaches 0', () => {
    const less = removeQuantityInList(items, 'A', 2);
    expect(groupItems(less).find(x => x.codigo === 'A').cantidad).toBe(1);

    const none = removeQuantityInList(items, 'A', 10);
    expect(none.some(x => x.codigo === 'A')).toBeFalse();
  });

  it('countItems counts raw items qty', () => {
    expect(countItems(items)).toBe(1 + 2 + 1);
  });

  it('totalFromGrouped sums CLP properly', () => {
    const g = groupItems(items);
    const total = totalFromGrouped(g);
    expect(total).toBe(parseCLP('$1.000') * 3 + parseCLP('$2.000') * 1);
  });
});

