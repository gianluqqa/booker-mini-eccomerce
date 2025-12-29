// DTOs para Stock Reservation

// Item de reserva (dentro de la reserva general)
export interface IReservationItem {
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
}

// Respuesta al crear reserva de stock
export interface IStockReservationResponse {
  reservationId: string;
  items: IReservationItem[];
  totalAmount: number;
  expiresAt: string;
  totalMinutes: number;
  message: string;
}

// Estados del temporizador
export interface ITimerState {
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
