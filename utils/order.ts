export function parseOrderId(value: string): string {
  const orderId = value.replace(/\|/g, '').trim();
  if (!orderId || /\s/.test(orderId)) {
    throw new Error(`Expected a single order ID, received: ${JSON.stringify(value)}`);
  }
  return orderId;
}