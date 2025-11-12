import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientDto } from '../../common/dto/client.dto';

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ClientFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
  uf?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = '/api/clients';

  constructor(private http: HttpClient) {}

  getClients(
    filters?: ClientFilters
  ): Observable<PaginatedResponse<ClientDto>> {
    let params = new URLSearchParams();

    if (filters) {
      if (filters.page) params.set('page', filters.page.toString());
      if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());
      if (filters.name) params.set('name', filters.name);
      if (filters.cpf) params.set('cpf', filters.cpf);
      if (filters.phone) params.set('phone', filters.phone);
      if (filters.email) params.set('email', filters.email);
      if (filters.uf) params.set('uf', filters.uf);
    }

    const response = this.http.get<PaginatedResponse<ClientDto>>(
      this.apiUrl + '?' + params
    );
    return response;
  }

  getClient(id: number): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${this.apiUrl}/${id}`);
  }

  createClient(client: ClientDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.apiUrl, client);
  }

  updateClient(id: number, client: ClientDto): Observable<ClientDto> {
    console.log(`${this.apiUrl}/${id}`);
    return this.http.put<ClientDto>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
