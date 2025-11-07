import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ModalComponent } from '../modal/modal.component';
import { ClientDto } from '../../common/dto/client.dto';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-page',
  imports: [
    TableModule,
    InputTextModule,
    IftaLabelModule,
    FormsModule,
    KeyValuePipe,
    ButtonModule,
    SelectModule,
    ModalComponent,
  ],
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css',
})
export class ClientPageComponent implements OnInit {
  page!: number;
  pageSize!: number;
  totalRecords: number = 0;
  filters = {
    name: '',
    cpf: '',
    phone: '',
    email: '',
    uf: '',
  };
  filtersNameMapping = new Map<keyof typeof this.filters, string>([
    ['name', 'Nome'],
    ['cpf', 'CPF'],
    ['phone', 'Telefone'],
    ['email', 'Email'],
    ['uf', 'UF'],
  ]);
  clients!: ClientDto[];
  headers: string[] = [];

  constructor(private clientService: ClientService) {}

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
      .subscribe((response) => {
        this.clients = response.data;
        this.totalRecords = response.totalItems;
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
}
