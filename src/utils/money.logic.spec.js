import { parseCLP, formatCLP } from './money.logic.js';

describe('money.logic', () => {
  it('parseCLP extracts digits', () => {
    expect(parseCLP('$1.234 CLP')).toBe(1234);
    expect(parseCLP('')).toBe(0);
  });

  it('formatCLP formats number', () => {
    const out = formatCLP(1234);
    expect(typeof out).toBe('string');
    expect(out).toContain('1');
  });
});

