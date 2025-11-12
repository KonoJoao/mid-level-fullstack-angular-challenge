import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { OrderModalComponent } from './order-modal.component';
import { OrderService } from '../../services/order/order.service';
import { OrderDto } from '../../common/dto/order.dto';
import { OrderStatus } from '../../common/enum/status.enum';
import { ClientDto } from '../../common/dto/client.dto';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('OrderModalComponent', () => {
  let component: OrderModalComponent;
  let fixture: ComponentFixture<OrderModalComponent>;
  let orderService: jasmine.SpyObj<OrderService>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockClient: ClientDto = {
    id: 1,
    name: 'João Silva',
    cpf: '12345678901',
    phone: '62999887766',
    email: 'joao@email.com',
    uf: 'GO',
  };

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

  beforeEach(async () => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', [
      'createOrder',
      'updateOrder',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [OrderModalComponent, HttpClientTestingModule],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderModalComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.orderForm.value.clientId).toBeNull();
      expect(component.orderForm.value.status).toBe(OrderStatus.PENDENTE);
      expect(component.items.length).toBe(1);
    });

    it('should populate form when orderData is provided', () => {
      component.orderData = mockOrder;
      component.ngOnChanges({
        orderData: {
          currentValue: mockOrder,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.orderForm.value.clientId).toBe(mockOrder.clientId);
      expect(component.orderForm.value.status).toBe(mockOrder.status);
      expect(component.items.length).toBe(1);
    });

    it('should have required validators', () => {
      const form = component.orderForm;

      form.patchValue({
        clientId: '',
        status: '',
      });

      expect(form.get('clientId')?.hasError('required')).toBe(true);
      expect(form.get('status')?.hasError('required')).toBe(true);
    });
  });

  describe('FormArray - Items', () => {
    it('should add new item to FormArray', () => {
      const initialLength = component.items.length;
      component.addItem();
      expect(component.items.length).toBe(initialLength + 1);
    });

    it('should remove item from FormArray', () => {
      component.addItem();
      component.addItem();
      const initialLength = component.items.length;

      component.removeItem(0);
      expect(component.items.length).toBe(initialLength - 1);
    });

    it('should not remove last item if only one exists', () => {
      component.addItem();
      component.removeItem(0);
      expect(component.items.length).toBe(1);
    });

    it('should calculate item total correctly', () => {
      component.addItem();
      const item = component.items.at(1);
      item.patchValue({
        name: 'Produto',
        value: 50,
        quantity: 3,
      });

      component.calculateItemTotal(1);
      const total = item.get('totalValue')?.value;
      expect(total).toBe(150);
    });

    it('should calculate order total correctly', () => {
      component.items.at(0).patchValue({
        name: 'Produto A',
        value: 100,
        quantity: 2,
      });
      component.calculateItemTotal(0);

      component.addItem();
      component.items.at(1).patchValue({
        name: 'Produto B',
        value: 50,
        quantity: 3,
      });
      component.calculateItemTotal(1);

      const total = component.getTotalOrder();
      expect(total).toBe(350); // (100 * 2) + (50 * 3)
    });
  });

  describe('Client Selection', () => {
    it('should update client options when clients input changes', () => {
      component.clients = [mockClient];
      component.ngOnChanges({
        clients: {
          currentValue: [mockClient],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.clientOptions).toEqual([
        { label: 'João Silva', value: 1 },
      ]);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.clients = [mockClient];
      component.updateClientOptions();
      component.orderForm.patchValue({
        clientId: 1,
        status: OrderStatus.PENDENTE,
      });
      component.items.at(0).patchValue({
        name: 'Produto A',
        value: 100,
        quantity: 2,
      });
      component.calculateItemTotal(0);
    });

    it('should not submit if form is invalid', () => {
      component.orderForm.reset();
      component.onSubmit();

      expect(orderService.createOrder).not.toHaveBeenCalled();
      expect(orderService.updateOrder).not.toHaveBeenCalled();
    });

    it('should emit saveOrder event on successful save', () => {
      spyOn(component.saveOrder, 'emit');
      component.orderData = new OrderDto();
      orderService.createOrder.and.returnValue(of(mockOrder));

      component.onSubmit();

      expect(component.saveOrder.emit).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('onCancel', () => {
    it('should reset form and emit closeModal', () => {
      spyOn(component.closeModal, 'emit');
      // component.addItem();

      component.onCancel();

      expect(component.items.length).toBe(1);
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('Status Options', () => {
    it('should have all status options available', () => {
      expect(component.statusOptions).toEqual([
        { label: 'Pendente', value: OrderStatus.PENDENTE },
        { label: 'Aprovado', value: OrderStatus.APROVADO },
        { label: 'Entregue', value: OrderStatus.ENTREGUE },
        { label: 'Cancelado', value: OrderStatus.CANCELADO },
      ]);
    });
  });
});
