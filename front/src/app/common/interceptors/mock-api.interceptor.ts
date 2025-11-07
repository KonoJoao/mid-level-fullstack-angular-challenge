import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import mockClients from '../json/clients.json';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;

  // GET /api/clients
  if (url.includes('/api/clients') && method === 'GET') {
    // Extrair parâmetros da URL
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    console.log(urlParams);
    const page = parseInt(urlParams.get('page') || '1');
    const pageSize = parseInt(urlParams.get('pageSize') || '10');
    const name = urlParams.get('name') || '';
    const cpf = urlParams.get('cpf') || '';
    const phone = urlParams.get('phone') || '';
    const email = urlParams.get('email') || '';
    const uf = urlParams.get('uf') || '';

    // Filtrar clientes
    let filteredClients = [...mockClients];
    console.log(page, pageSize);
    if (name) {
      filteredClients = filteredClients.filter((client) =>
        client.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (cpf) {
      filteredClients = filteredClients.filter((client) =>
        client.cpf.includes(cpf)
      );
    }
    if (phone) {
      filteredClients = filteredClients.filter((client) =>
        client.phone.includes(phone)
      );
    }
    if (email) {
      filteredClients = filteredClients.filter((client) =>
        client.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    if (uf) {
      filteredClients = filteredClients.filter(
        (client) => client.uf.toLowerCase() === uf.toLowerCase()
      );
    }

    // Calcular paginação
    const totalItems = filteredClients.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    return of(
      new HttpResponse({
        status: 200,
        body: {
          data: paginatedClients,
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      })
    ).pipe(delay(500));
  }

  // POST /api/clients
  if (url.includes('/api/clients') && method === 'POST') {
    const newClient = { ...(req.body as any), id: Date.now() };
    mockClients.push(newClient);
    return of(
      new HttpResponse({
        status: 201,
        body: newClient,
      })
    ).pipe(delay(500));
  }

  // PUT /api/clients/:id
  if (url.match(/\/api\/clients\/\d+/) && method === 'PUT') {
    return of(
      new HttpResponse({
        status: 200,
        body: { ...(req.body as any) },
      })
    ).pipe(delay(500));
  }

  // DELETE /api/clients/:id
  if (url.match(/\/api\/clients\/\d+/) && method === 'DELETE') {
    return of(
      new HttpResponse({
        status: 204,
        body: null,
      })
    ).pipe(delay(500));
  }

  // Se não for uma rota mockada, continua com a requisição real
  return next(req);
};
