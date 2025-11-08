import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import mockClientsJson from '../json/clients.json';
import mockOrdersJson from '../json/orders.json';
let mockClients = [...mockClientsJson];
let mockOrders = [...mockOrdersJson];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  // GET /api/clients
  if (url.includes('/api/clients') && method === 'GET') {
    // Extrair parâmetros da URL
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const page = parseInt(urlParams.get('page') || '1');
    const pageSize = parseInt(urlParams.get('pageSize') || '10');
    const name = urlParams.get('name') || '';
    const cpf = urlParams.get('cpf') || '';
    const phone = urlParams.get('phone') || '';
    const email = urlParams.get('email') || '';
    const uf = urlParams.get('uf') || '';

    // Filtrar clientes
    let filteredClients = [...mockClients];
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
  if (url.match(/\/api\/clients\/\d+$/) && method === 'PUT') {
    const idMatch = url.match(/\/api\/clients\/(\d+)$/);
    const clientId = idMatch ? parseInt(idMatch[1]) : null;

    if (clientId) {
      const clientIndex = mockClients.findIndex((c) => c.id === clientId);

      if (clientIndex !== -1) {
        const updatedClient = { ...(req.body as any), id: clientId };
        mockClients[clientIndex] = updatedClient;

        return of(
          new HttpResponse({
            status: 200,
            body: updatedClient,
          })
        ).pipe(delay(500));
      } else {
        return of(
          new HttpResponse({
            status: 404,
            body: { message: 'Cliente não encontrado' },
          })
        ).pipe(delay(500));
      }
    }
  }

  // DELETE /api/clients/:id
  if (url.match(/\/api\/clients\/\d+/) && method === 'DELETE') {
    const idMatch = url.match(/\/api\/clients\/(\d+)$/);
    const clientId = idMatch ? parseInt(idMatch[1]) : null;

    if (clientId) {
      mockClients = mockClients.filter((client) => client.id != clientId);
    }
    return of(
      new HttpResponse({
        status: 204,
        body: null,
      })
    ).pipe(delay(500));
  }

  // GET /api/orders
  // GET /api/orders
  if (
    url.includes('/api/orders') &&
    method === 'GET' &&
    !url.match(/\/api\/orders\/[\w-]+$/)
  ) {
    // Extrair parâmetros da URL
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const page = parseInt(urlParams.get('page') || '1');
    const pageSize = parseInt(urlParams.get('pageSize') || '10');
    const clientId = urlParams.get('clientId')
      ? parseInt(urlParams.get('clientId')!)
      : null;
    const clientName = urlParams.get('clientName') || '';
    const status = urlParams.get('status') || '';

    // Filtrar pedidos
    let filteredOrders = [...mockOrders];

    console.log(url, clientId, clientName);

    if (clientId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.clientId === clientId
      );
    }

    if (clientName) {
      filteredOrders = filteredOrders.filter((order) =>
        order.clientName.toLowerCase().includes(clientName.toLowerCase())
      );
    }

    if (status) {
      filteredOrders = filteredOrders.filter((order) =>
        order.status.includes(status)
      );
    }

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return of(
      new HttpResponse({
        status: 200,
        body: {
          data: paginatedOrders,
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      })
    ).pipe(delay(500));
  }

  // POST /api/orders
  if (url.includes('/api/orders') && method === 'POST') {
    const newOrder = {
      ...(req.body as any),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return of(
      new HttpResponse({
        status: 201,
        body: newOrder,
      })
    ).pipe(delay(500));
  }

  // PUT /api/orders/:id
  if (url.match(/\/api\/orders\/[\w-]+$/) && method === 'PUT') {
    const idMatch = url.match(/\/api\/orders\/([\w-]+)$/);
    const orderId = idMatch ? idMatch[1] : null;

    if (orderId) {
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);

      if (orderIndex !== -1) {
        const updatedOrder = { ...(req.body as any), id: orderId };
        mockOrders[orderIndex] = updatedOrder;

        return of(
          new HttpResponse({
            status: 200,
            body: updatedOrder,
          })
        ).pipe(delay(500));
      } else {
        return of(
          new HttpResponse({
            status: 404,
            body: { message: 'Pedido não encontrado' },
          })
        ).pipe(delay(500));
      }
    }
  }

  // DELETE /api/orders/:id
  if (url.match(/\/api\/orders\/[\w-]+$/) && method === 'DELETE') {
    const idMatch = url.match(/\/api\/orders\/([\w-]+)$/);
    const orderId = idMatch ? idMatch[1] : null;

    if (orderId) {
      const orderIndex = mockOrders.findIndex((o) => o.id === orderId);

      if (orderIndex !== -1) {
        mockOrders.splice(orderIndex, 1);

        return of(
          new HttpResponse({
            status: 204,
            body: null,
          })
        ).pipe(delay(500));
      }
    }
  }

  // Se não for uma rota mockada, continua com a requisição real
  return next(req);
};
