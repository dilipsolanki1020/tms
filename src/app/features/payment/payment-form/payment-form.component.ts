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
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['Cash', Validators.required],
      referenceNumber: [''],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadService.getAll().subscribe(loads => {
      this.loads = loads;
    });
    
    this.partyService.getAll().subscribe(parties => {
      this.parties = parties;
    });
    
    this.paymentId = this.route.snapshot.paramMap.get('id');
    if (this.paymentId) {
      this.isEdit = true;
      this.paymentService.getById(this.paymentId).subscribe(payment => {
        this.form.patchValue(payment);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const paymentData = this.form.value;
      const payment: Payment = {
        ...paymentData,
        paymentDate: new Date(paymentData.paymentDate)
      };
      
      if (this.isEdit && this.paymentId) {
        this.paymentService.update(this.paymentId, payment).subscribe(() => {
          this.router.navigate(['/payment']);
        });
      } else {
        this.paymentService.create(payment).subscribe(() => {
          this.router.navigate(['/payment']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/payment']);
  }
}
