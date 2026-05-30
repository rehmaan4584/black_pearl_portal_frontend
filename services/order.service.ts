import { apiRequest } from '@/lib/api';
import type { OrderDetail, OrderListItem, OrderStatus } from '@/types/order.types';

export async function fetchOrders(): Promise<OrderListItem[]> {
  return apiRequest('orders', 'GET');
}

export async function fetchOrderById(orderId: number): Promise<OrderDetail> {
  return apiRequest(`orders/${orderId}`, 'GET');
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<OrderDetail> {
  return apiRequest(`orders/${orderId}/status`, 'PATCH', { status });
}
