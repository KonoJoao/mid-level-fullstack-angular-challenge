import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { OrderService, PaginatedResponse } from './order.service';
import { OrderDto } from '../../common/dto/order.dto';
import { OrderStatus } from '../../common/enum/status.enum';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder: OrderDto = {
    id: 'uuid-123',
    clientId: 1,
    clientName: 'João Silva',
    status: OrderStatus.PENDENTE,
    items: [
      {
        name: 'Produto A',
        value: 100,
        quantity: 2,
        totalValue: 200,
      },
    ],
    totalOrder: 200,
    createdAt: '2024-01-01T10:00:00Z',
  };

  const mockPaginatedResponse: PaginatedResponse<OrderDto> = {
    data: [mockOrder],
    page: 1,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrder', () => {
    it('should return a single order by id', () => {
      service.getOrder('uuid-123').subscribe((order) => {
        expect(order).toEqual(mockOrder);
        expect(order.id).toBe('uuid-123');
      });

      const req = httpMock.expectOne('/api/orders/uuid-123');
      expect(req.request.method).toBe('GET');
      req.flush(mockOrder);
    });
  });

  describe('createOrder', () => {
    it('should create a new order', () => {
      const newOrder: OrderDto = {
        clientId: 2,
        clientName: 'Maria Santos',
        status: OrderStatus.PENDENTE,
        items: [
          {
            name: 'Produto B',
            value: 50,
            quantity: 1,
            totalValue: 50,
          },
        ],
        totalOrder: 50,
        createdAt: '2024-01-02T10:00:00Z',
      };

      service.createOrder(newOrder).subscribe((order) => {
        expect(order.id).toBeDefined();
        expect(order.clientName).toBe('Maria Santos');
      });

      const req = httpMock.expectOne('/api/orders');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newOrder);
      req.flush({ ...newOrder, id: 'uuid-456' });
    });
  });

  describe('updateOrder', () => {
    it('should update an existing order', () => {
      const updatedOrder: OrderDto = {
        ...mockOrder,
        status: OrderStatus.APROVADO,
      };

      service.updateOrder('uuid-123', updatedOrder).subscribe((order) => {
        expect(order.status).toBe(OrderStatus.APROVADO);
      });

      const req = httpMock.expectOne('/api/orders/uuid-123');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedOrder);
      req.flush(updatedOrder);
    });
  });
});
