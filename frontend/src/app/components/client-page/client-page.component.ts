import { Component, EventEmitter, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ModalComponent } from '../modal/modal.component';
import { ClientDto } from '../../common/dto/client.dto';
import { ClientService } from '../../services/client/client.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-client-page',
  imports: [
    TableModule,
    InputTextModule,
    IftaLabelModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    ModalComponent,
    ToastModule,
  ],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css',
  providers: [MessageService],
})
export class ClientPageComponent implements OnInit {
  page!: number;
  pageSize!: number;
  totalRecords: number = 0;
  openModal: boolean = false;
  modalTitle: string = '';
  selectedClient: ClientDto = new ClientDto();

  filters = {
    name: '',
    cpf: '',
    phone: '',
    email: '',
    uf: '',
  };
  filtersArray: Array<{
    key: 'name' | 'cpf' | 'phone' | 'email' | 'uf';
    label: string;
  }> = [
    { key: 'name', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'phone', label: 'Telefone' },
    { key: 'email', label: 'Email' },
    { key: 'uf', label: 'UF' },
  ];
  clients!: ClientDto[];
  headers: string[] = ['name', 'cpf', 'phone', 'email', 'uf'];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.headers = Object.keys(new ClientDto());
    this.page = 1;
    this.pageSize = 8;
    this.loadClients();
  }

  loadClients(): void {
    this.clientService
      .getClients({
        page: this.page,
        pageSize: this.pageSize,
        ...this.filters,
      })
      .subscribe({
        next: (response) => {
          this.clients = response.data;
          this.totalRecords = response.totalItems;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar clientes. Tente novamente.',
          });
        },
      });
  }

  onPageChange(event: any): void {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;

    this.loadClients();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadClients();
  }

  setOpenEditModal(client: ClientDto) {
    this.modalTitle = 'Editar Cliente';
    this.openModal = true;
    this.selectedClient = client;
  }

  setOpenCreateModal() {
    this.modalTitle = 'Adicionar Cliente';
    this.openModal = true;
  }

  handleModalClose() {
    this.openModal = false;
    this.selectedClient = new ClientDto();
  }

  handleClientSaved(client: ClientDto) {
    this.openModal = false;
    this.selectedClient = new ClientDto();
    this.loadClients(); // Recarrega a lista
  }

  handleDeleteClient(id: number): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cliente excluído com sucesso!',
        });
        this.loadClients();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir cliente. Tente novamente.',
        });
        console.error('Erro ao excluir cliente:', error);
      },
    });
  }
}
