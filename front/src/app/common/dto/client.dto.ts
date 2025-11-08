export class ClientDto {
  id?: number;
  name: string;
  phone: string;
  email: string;
  uf: string;
  cpf: string;

  constructor() {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.uf = '';
    this.cpf = '';
  }
}
