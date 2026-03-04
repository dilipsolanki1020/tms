import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  private loadPayments(): void {
    this.paymentService.getAll().subscribe(payments => {
      this.payments = payments;
    });
  }

  deletePayment(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.paymentService.delete(id).subscribe(() => {
        this.loadPayments();
      });
    }
  }
}
