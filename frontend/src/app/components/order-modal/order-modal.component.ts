import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { OrderDto, OrderItemDto } from '../../common/dto/order.dto';
import { OrderService } from '../../services/order/order.service';
import { OrderStatus } from '../../common/enum/status.enum';
import { ClientDto } from '../../common/dto/client.dto';

@Component({
  selector: 'app-order-modal',
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
    ToastModule,
    SelectModule,
    DecimalPipe,
  ],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.css',
  providers: [MessageService],
})
export class OrderModalComponent implements OnInit, OnChanges {
  @Input() title: string = 'Adicionar Pedido';
  @Input() isVisualizationMode!: boolean;
  @Input() open: boolean = false;
  @Input() orderData: OrderDto = new OrderDto();
  @Input() clients: ClientDto[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveOrder = new EventEmitter<OrderDto>();

  orderForm!: FormGroup;
  clientOptions: Array<{ label: string; value: number }> = [];
  statusOptions = [
    { label: 'Pendente', value: OrderStatus.PENDENTE },
    { label: 'Aprovado', value: OrderStatus.APROVADO },
    { label: 'Entregue', value: OrderStatus.ENTREGUE },
    { label: 'Cancelado', value: OrderStatus.CANCELADO },
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.updateClientOptions();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderData'] && !changes['orderData'].firstChange) {
      this.initForm();
    }
    if (changes['clients']) {
      this.updateClientOptions();
    }
  }

  updateClientOptions(): void {
    this.clientOptions = this.clients.map((client) => ({
      label: client.name,
      value: client.id!,
    }));
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      clientId: [
        this.orderData.clientId || null,
        [Validators.required, Validators.min(1)],
      ],
      status: [
        this.orderData.status || OrderStatus.PENDENTE,
        [Validators.required],
      ],
      items: this.fb.array(
        this.orderData.items?.length > 0
          ? this.orderData.items.map((item) => this.createItemFormGroup(item))
          : [this.createItemFormGroup()]
      ),
    });

    // Observa mudanças no clientId para atualizar o clientName automaticamente
    this.orderForm.get('clientId')?.valueChanges.subscribe((clientId) => {
      const selectedClient = this.clients.find((c) => c.id === clientId);
      if (selectedClient) {
        // Armazena o nome do cliente para ser enviado no submit
        this.orderForm.patchValue(
          { clientName: selectedClient.name },
          { emitEvent: false }
        );
      }
    });
  }

  createItemFormGroup(item?: OrderItemDto): FormGroup {
    return this.fb.group({
      name: [item?.name || '', [Validators.required]],
      value: [item?.value || 0, [Validators.required, Validators.min(0)]],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      totalValue: [{ value: item?.totalValue || 0, disabled: true }],
    });
  }

  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateItemTotal(index: number): void {
    const item = this.items.at(index);
    const value = item.get('value')?.value || 0;
    const quantity = item.get('quantity')?.value || 0;
    const total = value * quantity;
    item.get('totalValue')?.setValue(total);
  }

  getTotalOrder(): number {
    return this.items.controls.reduce((sum, item) => {
      return sum + (item.get('totalValue')?.value || 0);
    }, 0);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formData = this.orderForm.getRawValue();
      const selectedClient = this.clients.find(
        (c) => c.id === formData.clientId
      );

      const orderToSave: OrderDto = {
        ...formData,
        clientName: selectedClient?.name || '',
        id: this.orderData.id,
        totalOrder: this.getTotalOrder(),
        createdAt: this.orderData.createdAt || new Date().toISOString(),
      };

      if (this.orderData.id) {
        // Edição
        this.orderService
          .updateOrder(this.orderData.id, orderToSave)
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Pedido atualizado com sucesso!',
              });
              this.saveOrder.emit(response);
              this.orderForm.reset();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar pedido. Tente novamente.',
              });
              console.error('Erro ao atualizar pedido:', error);
            },
          });
      } else {
        // Criação
        this.orderService.createOrder(orderToSave).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pedido criado com sucesso!',
            });
            this.saveOrder.emit(response);
            this.orderForm.reset();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar pedido. Tente novamente.',
            });
            console.error('Erro ao criar pedido:', error);
          },
        });
      }
    } else {
      Object.keys(this.orderForm.controls).forEach((key) => {
        this.orderForm.get(key)?.markAsTouched();
      });
      this.items.controls.forEach((item) => {
        Object.keys((item as FormGroup).controls).forEach((key) => {
          item.get(key)?.markAsTouched();
        });
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
    this.orderForm.reset();
  }

  handleVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeModal.emit();
    }
  }
}
