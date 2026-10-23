import { test, expect } from '@playwright/test';
import { parseOrderId } from '../../utils/order';

test.describe('Order ID parsing', () => {
  test('strips confirmation separators and whitespace', () => {
    expect(parseOrderId(' | 68abc123 | ')).toBe('68abc123');
  });

  test('accepts an already normalized ID', () => {
    expect(parseOrderId('68abc123')).toBe('68abc123');
  });

  for (const value of ['', '   ', ' | | ', '| first | | second |']) {
    test(`rejects missing or multiple IDs: ${JSON.stringify(value)}`, () => {
      expect(() => parseOrderId(value)).toThrow('Expected a single order ID');
    });
  }
});