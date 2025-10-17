export class CreateOrderDto {
  order_id: string;
  buyer_id: string;
  order_number: number;
  address: string;
  items: string[];
}
