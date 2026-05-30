"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import {
  fetchOrderById,
  fetchOrders,
  updateOrderStatus,
} from "@/services/order.service";
import type { OrderDetail, OrderListItem, OrderStatus } from "@/types/order.types";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatMoney(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

function getNextStatus(status: OrderStatus): OrderStatus | null {
  if (status === "PAID") return "SHIPPED";
  if (status === "SHIPPED") return "DELIVERED";
  return null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load orders"));
    } finally {
      setLoading(false);
    }
  }

  async function openOrderDetail(orderId: number) {
    setDetailLoading(true);
    setIsOpen(true);
    try {
      const detail = await fetchOrderById(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load order details"));
      setIsOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleStatusUpdate(nextStatus: OrderStatus) {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const updated = await updateOrderStatus(selectedOrder.id, nextStatus);
      setSelectedOrder(updated);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updated.id
            ? { ...order, status: updated.status }
            : order,
        ),
      );
      toast.success(`Order marked as ${nextStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update order status"));
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center glass rounded-[2.5rem] border border-white/5 shadow-2xl">
        <ClipboardList className="size-16 text-teal-100/10 mx-auto mb-6" />
        <p className="text-teal-100/60 italic text-lg font-medium tracking-wide">
          No orders yet. Customer checkout orders will appear here.
        </p>
      </div>
    );
  }

  const nextStatus = selectedOrder ? getNextStatus(selectedOrder.status) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track customer orders and update fulfillment status.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>
                <div>
                  <p>{order.customer.email}</p>
                  {order.customer.name && (
                    <p className="text-sm text-muted-foreground">
                      {order.customer.name}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{order.itemCount}</TableCell>
              <TableCell>{formatMoney(order.totalAmount)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => openOrderDetail(order.id)}
                >
                  <Eye className="size-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder ? `Order #${selectedOrder.id}` : "Order details"}
            </DialogTitle>
            <DialogDescription>
              Customer, line items, and fulfillment actions.
            </DialogDescription>
          </DialogHeader>

          {detailLoading || !selectedOrder ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <OrderStatusBadge status={selectedOrder.status} />
                <span className="text-sm text-muted-foreground">
                  Placed {formatDate(selectedOrder.createdAt)}
                </span>
              </div>

              <div className="grid gap-4 rounded-xl border border-white/10 bg-white/2 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer.email}</p>
                  {selectedOrder.customer.name && (
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customer.name}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatMoney(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Line items
                </p>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.variant.size} / {item.variant.color}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p>
                          {item.quantity} x {formatMoney(item.price)}
                        </p>
                        <p className="font-semibold text-white">
                          {formatMoney(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {nextStatus && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    disabled={updatingStatus}
                    className="cyan-glow"
                  >
                    {updatingStatus
                      ? "Updating..."
                      : `Mark as ${nextStatus}`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
