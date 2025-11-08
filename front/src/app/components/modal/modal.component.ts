import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ClientDto } from '../../common/dto/client.dto';
import { ClientService } from '../../services/client/client.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
    ToastModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [MessageService],
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() title: string = 'Adicionar Cliente';
  @Input() open: boolean = false;
  @Input() clientData: ClientDto = new ClientDto();
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveClient = new EventEmitter<ClientDto>();

  clientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Atualiza o formulário quando clientData muda
    if (changes['clientData'] && !changes['clientData'].firstChange) {
      this.initForm();
    }
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      name: [
        this.clientData.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
      cpf: [
        this.clientData.cpf || '',
        [Validators.required, Validators.pattern(/^\d{11}$/)],
      ],
      phone: [this.clientData.phone || '', [Validators.required]],
      email: [
        this.clientData.email || '',
        [Validators.required, Validators.email],
      ],
      uf: [
        this.clientData.uf || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      const clientToSave: ClientDto = {
        ...formData,
        id: this.clientData.id,
      };

      if (this.clientData.id) {
        // Edição
        this.clientService
          .updateClient(this.clientData.id, clientToSave)
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente atualizado com sucesso!',
              });
              this.saveClient.emit(response);
              this.clientForm.reset();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar cliente. Tente novamente.',
              });
              console.error('Erro ao atualizar cliente:', error);
            },
          });
      } else {
        // Criação
        this.clientService.createClient(clientToSave).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cliente criado com sucesso!',
            });
            this.saveClient.emit(response);
            this.clientForm.reset();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar cliente. Tente novamente.',
            });
            console.error('Erro ao criar cliente:', error);
          },
        });
      }
    } else {
      Object.keys(this.clientForm.controls).forEach((key) => {
        this.clientForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.closeModal.emit();
    this.clientForm.reset();
  }

  handleVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeModal.emit();
    }
  }
}
