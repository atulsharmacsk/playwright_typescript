export interface Product {
  name: string;
  price: string;
}

export interface PaymentDetails {
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholder: string;
  country: string;
}

export const shopData = {
  productName: 'ZARA COAT 3',
  coupon: 'rahulshettyacademy',
  payment: {
    expiryMonth: '05',
    expiryYear: '30',
    cvv: '321',
    cardholder: 'Test Shopper',
    country: 'India',
  } satisfies PaymentDetails,
};