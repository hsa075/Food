export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type OrderType = 'TAKEAWAY' | 'DINE_IN';

export interface OrderItemDTO {
  menuItemId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderDTO {
  outletId: string;
  quantity: number;
  orderType: OrderType;
  couponCode?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export interface PriceBreakdown {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  packagingFee: number;
  taxAmount: number; // 5% GST on restaurant food
  totalAmount: number;
  couponApplied?: string | null;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  userId?: string | null;
  outletId: string;
  outletName: string;
  outletLocality: string;
  outletAddress: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  orderType: OrderType;
  pickupOtp: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  packagingFee: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string | null;
  estimatedReadyAt: string;
  createdAt: string;
  updatedAt: string;
  palya1Name?: string;
  palya2Name?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  cancellationReason?: string;
}
