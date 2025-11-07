import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-modal',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  @Input() title: string = 'Adicionar Cliente';
  open!: boolean;
  clientForm!: FormGroup;

  ngOnInit(): void {
    this.open = true;
    this.initForm();
  }

  constructor(private fb: FormBuilder) {}

  initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      uf: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    });
  }

  setOpenModal(isOpen: boolean) {
    this.open = isOpen;
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.setOpenModal(false);
      this.clientForm.reset();
    } else {
      Object.keys(this.clientForm.controls).forEach((key) => {
        this.clientForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.setOpenModal(false);
    this.clientForm.reset();
  }
}
