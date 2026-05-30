import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  PAID: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  SHIPPED: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
  DELIVERED: 'border-primary/40 bg-primary/10 text-primary',
  CANCELLED: 'border-red-500/40 bg-red-500/10 text-red-200',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {status}
    </Badge>
  );
}
