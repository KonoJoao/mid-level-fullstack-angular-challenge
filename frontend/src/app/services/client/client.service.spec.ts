import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ClientService, PaginatedResponse } from './client.service';
import { ClientDto } from '../../common/dto/client.dto';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { mockApiInterceptor } from '../../common/interceptors/mock-api.interceptor';

describe('ClientService with Mock Interceptor', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const mockClient: ClientDto = {
    id: 1,
    name: 'João Silva',
    cpf: '12345678901',
    phone: '62999887766',
    email: 'joao@email.com',
    uf: 'GO',
  };

  const mockPaginatedResponse: PaginatedResponse<ClientDto> = {
    data: [mockClient],
    page: 1,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClientTesting(),
        provideHttpClient(),
        {
          provide: HTTP_INTERCEPTORS,
          useValue: mockApiInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
