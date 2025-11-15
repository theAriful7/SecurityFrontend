import { OrderItemRequestDTO, OrderItemResponseDTO } from "./order-item.model";
import { OrderStatus } from "./orderStatus";

export interface OrderRequestDTO {
  userId: number;
  shippingAddressId: number;
  items: OrderItemRequestDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderResponseDTO {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  shippingAddress: any;
  items: OrderItemResponseDTO[];
  totalAmount: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  vendorId?: number;
  vendorName?: string;
  riderId?: number;
  riderName?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  updatedBy: string;
  notes?: string;
}