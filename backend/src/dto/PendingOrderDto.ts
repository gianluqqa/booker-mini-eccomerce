export interface PendingOrderResponse {
  id: string;
  total: number;
  createdAt: Date;
  expiresAt?: Date;
  itemsCount: number;
  message: string;
  actionRequired: string;
}

export interface PendingOrderError {
  success: false;
  message: string;
  data: PendingOrderResponse;
}
