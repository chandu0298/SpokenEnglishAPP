import apiClient from './client';

export interface OrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_key_id: string;
}

export async function createOrder(): Promise<OrderResponse> {
  const response = await apiClient.post('/api/payments/create-order');
  return response.data;
}
