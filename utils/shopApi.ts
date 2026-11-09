import type { APIRequestContext } from '@playwright/test';

export interface ShopProduct {
  _id: string;
  productName: string;
  [key: string]: unknown;
}

export async function getAllProducts(request: APIRequestContext): Promise<ShopProduct[]> {
  const response = await request.post('/api/ecom/product/get-all-products', { data: {} });
  if (!response.ok()) {
    throw new Error(`Failed to retrieve products: HTTP ${response.status()}`);
  }

  const body: unknown = await response.json();
  if (
    typeof body !== 'object' ||
    body === null ||
    !('data' in body) ||
    !Array.isArray(body.data)
  ) {
    throw new Error('Invalid response from the get-all-products endpoint.');
  }

  return body.data as ShopProduct[];
}