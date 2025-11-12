import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ModalComponent } from './modal.component';
import { ClientService } from '../../services/client/client.service';
import { ClientDto } from '../../common/dto/client.dto';
import { of, throwError } from 'rxjs';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let messageService: jasmine.SpyObj<MessageService>;

  const mockClient: ClientDto = {
    id: 1,
    name: 'João Silva',
    cpf: '12345678901',
    phone: '62999887766',
    email: 'joao@email.com',
    uf: 'GO',
  };

  beforeEach(async () => {
    const clientServiceSpy = jasmine.createSpyObj('ClientService', [
      'createClient',
      'updateClient',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ModalComponent, HttpClientTestingModule],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(
      ClientService
    ) as jasmine.SpyObj<ClientService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.clientForm.value).toEqual({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        uf: '',
      });
    });

    it('should populate form when clientData is provided', () => {
      component.clientData = mockClient;
      component.ngOnChanges({
        clientData: {
          currentValue: mockClient,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.clientForm.value).toEqual({
        name: mockClient.name,
        cpf: mockClient.cpf,
        phone: mockClient.phone,
        email: mockClient.email,
        uf: mockClient.uf,
      });
    });

    it('should have required validators', () => {
      const form = component.clientForm;

      form.patchValue({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        uf: '',
      });

      Object.keys(form.controls).forEach((key) => {
        form.get(key)?.markAsTouched();
      });

      expect(form.get('name')?.hasError('required')).toBe(true);
      expect(form.get('cpf')?.hasError('required')).toBe(true);
      expect(form.get('phone')?.hasError('required')).toBe(true);
      expect(form.get('email')?.hasError('required')).toBe(true);
      expect(form.get('uf')?.hasError('required')).toBe(true);
    });

    it('should validate CPF pattern', () => {
      const cpfControl = component.clientForm.get('cpf');
      cpfControl?.setValue('123');
      expect(cpfControl?.hasError('pattern')).toBe(true);

      cpfControl?.setValue('12345678901');
      expect(cpfControl?.hasError('pattern')).toBe(false);
    });

    it('should validate email format', () => {
      const emailControl = component.clientForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.clientForm.reset();
      component.onSubmit();

      expect(clientService.createClient).not.toHaveBeenCalled();
      expect(clientService.updateClient).not.toHaveBeenCalled();
    });

    it('should emit saveClient event on successful save', () => {
      spyOn(component.saveClient, 'emit');
      component.clientForm.patchValue(mockClient);
      component.clientData = new ClientDto();
      clientService.createClient.and.returnValue(of(mockClient));

      component.onSubmit();

      expect(component.saveClient.emit).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('onCancel', () => {
    it('should reset form and emit closeModal', () => {
      spyOn(component.closeModal, 'emit');
      component.clientForm.patchValue(mockClient);

      component.onCancel();

      expect(component.clientForm.value).toEqual({
        name: null,
        cpf: null,
        phone: null,
        email: null,
        uf: null,
      });
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('handleVisibleChange', () => {
    it('should emit closeModal when visible is false', () => {
      spyOn(component.closeModal, 'emit');

      component.handleVisibleChange(false);

      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should not emit closeModal when visible is true', () => {
      spyOn(component.closeModal, 'emit');

      component.handleVisibleChange(true);

      expect(component.closeModal.emit).not.toHaveBeenCalled();
    });
  });
});
