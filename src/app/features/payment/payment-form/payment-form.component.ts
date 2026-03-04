import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Payment, Load, Party } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { LoadService } from '../../../core/services/load.service';
import { PartyService } from '../../../core/services/party.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit {
  form: FormGroup;
  loads: Load[] = [];
  parties: Party[] = [];
  isEdit = false;
  paymentId: string | null = null;
  submitLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private loadService: LoadService,
    private partyService: PartyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      loadId: ['', Validators.required],
      partyId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(10000000)]],
      paymentMethod: ['Cash', Validators.required],
      referenceNumber: ['', [Validators.maxLength(50)]],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadService.getAll().subscribe(
      loads => {
        this.loads = loads;
      },
      error => {
        this.errorMessage = 'Failed to load loads';
      }
    );
    
    this.partyService.getAll().subscribe(
      parties => {
        this.parties = parties;
      },
      error => {
        this.errorMessage = 'Failed to load parties';
      }
    );
    
    this.paymentId = this.route.snapshot.paramMap.get('id');
    if (this.paymentId) {
      this.isEdit = true;
      this.paymentService.getById(this.paymentId).subscribe(
        payment => {
          this.form.patchValue(payment);
        },
        error => {
          this.errorMessage = 'Failed to load payment details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const paymentData = this.form.value;
      const payment: Payment = {
        ...paymentData,
        paymentDate: new Date(paymentData.paymentDate)
      };
      
      const operation = this.isEdit && this.paymentId 
        ? this.paymentService.update(this.paymentId, payment)
        : this.paymentService.create(payment);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/payment']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save payment. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/payment']);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.fieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('min')) {
      return `${this.fieldLabel(fieldName)} must be greater than 0`;
    }
    if (field?.hasError('max')) {
      return `${this.fieldLabel(fieldName)} is too high`;
    }
    if (field?.hasError('maxLength')) {
      const maxLength = field.getError('maxLength').requiredLength;
      return `${this.fieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }
    return '';
  }

  private fieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      amount: 'Amount',
      referenceNumber: 'Reference number'
    };
    return labels[fieldName] || fieldName;
  }
}
