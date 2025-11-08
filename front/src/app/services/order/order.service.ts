import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDto } from '../../common/dto/order.dto';

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderFilters {
  page?: number;
  pageSize?: number;
  clientId?: number;
  clientName?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(filters?: OrderFilters): Observable<PaginatedResponse<OrderDto>> {
    let params = new HttpParams();

    console.log('filtros no service: ', filters);

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize)
        params = params.set('pageSize', filters.pageSize.toString());
      if (filters.clientId)
        params = params.set('clientId', filters.clientId.toString());
      if (filters.clientName)
        params = params.set('clientName', filters.clientName);
      if (filters.status) params = params.set('status', filters.status);
    }

    return this.http.get<PaginatedResponse<OrderDto>>(
      this.apiUrl + '?' + params
    );
  }

  getOrder(id: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: OrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(this.apiUrl, order);
  }

  updateOrder(id: string, order: OrderDto): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
