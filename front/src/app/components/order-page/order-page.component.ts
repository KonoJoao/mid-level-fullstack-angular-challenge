import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { OrderDto } from '../../common/dto/order.dto';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { OrderService } from '../../services/order/order.service';
import { ClientService } from '../../services/client/client.service';
import { MessageService } from 'primeng/api';
import { ClientDto } from '../../common/dto/client.dto';

@Component({
  selector: 'app-order-page',
  imports: [
    TableModule,
    InputTextModule,
    IftaLabelModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    OrderModalComponent,
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
  providers: [MessageService],
})
export class OrderPageComponent implements OnInit {
  page: number = 1;
  pageSize: number = 8;
  totalRecords: number = 0;
  openModal: boolean = false;
  isVisualizationMode: boolean = false;
  modalTitle: string = '';
  selectedOrder: OrderDto = new OrderDto();
  clients: ClientDto[] = [];
  clientOptions: Array<{ label: string; value: number }> = [];

  filters = {
    clientId: null as number | null,
    status: '',
  };

  orders: OrderDto[] = [];
  headers: string[] = [];

  constructor(
    private orderService: OrderService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.headers = Object.keys(new OrderDto()).filter((key) => key !== 'items');
    this.loadClients();
    this.loadOrders();
  }

  loadClients(): void {
    this.clientService.getClients({ pageSize: 1000 }).subscribe({
      next: (response) => {
        this.clients = response.data;
        this.clientOptions = [
          { label: 'Todos os clientes', value: 0 },
          ...this.clients.map((client) => ({
            label: client.name,
            value: client.id!,
          })),
        ];
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      },
    });
  }

  loadOrders(): void {
    const filterParams: any = {
      page: this.page,
      pageSize: this.pageSize,
      status: this.filters.status,
    };

    // Só adiciona clientId se não for 0 (todos os clientes)
    if (this.filters.clientId && this.filters.clientId !== 0) {
      filterParams.clientId = this.filters.clientId;
    }

    this.orderService.getOrders(filterParams).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.totalRecords = response.totalItems;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar pedidos. Tente novamente.',
        });
        console.error('Erro ao carregar pedidos:', error);
      },
    });
  }

  onPageChange(event: any): void {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadOrders();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadOrders();
  }

  setOpenVisualizationModal(order: OrderDto) {
    this.selectedOrder = { ...order };
    this.modalTitle = 'Visualizar Pedido';
    this.openModal = true;
    this.isVisualizationMode = true;
  }

  setOpenCreateModal() {
    this.selectedOrder = new OrderDto();
    this.modalTitle = 'Adicionar Pedido';
    this.isVisualizationMode = false;
    this.openModal = true;
  }

  handleModalClose() {
    this.openModal = false;
    this.selectedOrder = new OrderDto();
  }

  handleOrderSaved(order: OrderDto) {
    this.openModal = false;
    this.loadOrders();
  }

  handleDeleteOrder(id: string) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pedido excluído com sucesso!',
          });
          this.loadOrders();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir pedido. Tente novamente.',
          });
          console.error('Erro ao excluir pedido:', error);
        },
      });
    }
  }
}
