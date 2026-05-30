export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderCustomer = {
  id: number;
  email: string;
  name: string | null;
};

export type OrderListItem = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  itemCount: number;
  customer: OrderCustomer;
};

export type OrderItem = {
  id: number;
  productVariantId: number;
  quantity: number;
  price: number;
  lineTotal: number;
  product: {
    id: number;
    title: string;
  };
  variant: {
    size: string;
    color: string;
  };
};

export type OrderDetail = OrderListItem & {
  updatedAt: string;
  items: OrderItem[];
};
