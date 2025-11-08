import { OrderStatus } from '../enum/status.enum';

export class OrderItemDto {
  name: string;
  value: number;
  quantity: number;
  totalValue: number;

  constructor() {
    this.name = '';
    this.value = 0;
    this.quantity = 0;
    this.totalValue = 0;
  }
}

export class OrderDto {
  id?: string;
  clientId: number;
  clientName: string;
  status: OrderStatus;
  items: OrderItemDto[];
  totalOrder: number;
  createdAt: string;

  constructor() {
    this.clientId = 0;
    this.clientName = '';
    this.status = OrderStatus.PENDENTE;
    this.items = [];
    this.totalOrder = 0;
    this.createdAt = '';
  }
}
