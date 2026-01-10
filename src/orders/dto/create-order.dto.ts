enum OrderStatus {
  'waiting payment',
  'cancelled',
  'completed',
  'shipped',
  'delivered',
}

export class CreateOrderDto {
  order_id: string;
  buyer_id: string;
  status: OrderStatus;
  order_number: number;
  address: string;
  items: [];
}
