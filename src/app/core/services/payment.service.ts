import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Payment } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly STORAGE_KEY = 'payments';
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let payments = this.localStorageService.getData<Payment[]>(this.STORAGE_KEY, []);
    
    if (payments.length === 0) {
      payments = MockDataFactory.getMockPayments();
      this.localStorageService.setData(this.STORAGE_KEY, payments);
    }
    
    this.paymentsSubject.next(payments);
  }

  private generateId(): string {
    return 'pay' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Payment[]> {
    return this.payments$;
  }

  getById(id: string): Observable<Payment> {
    const payments = this.paymentsSubject.value;
    const payment = payments.find(p => p.id === id);
    return of(payment!);
  }

  create(payment: Payment): Observable<Payment> {
    const payments = this.paymentsSubject.value;
    const newPayment: Payment = {
      ...payment,
      id: payment.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedPayments = [...payments, newPayment];
    this.localStorageService.setData(this.STORAGE_KEY, updatedPayments);
    this.paymentsSubject.next(updatedPayments);
    
    return of(newPayment);
  }

  update(id: string, payment: Payment): Observable<Payment> {
    const payments = this.paymentsSubject.value;
    const index = payments.findIndex(p => p.id === id);
    
    if (index > -1) {
      const updatedPayment: Payment = {
        ...payment,
        id,
        createdAt: payments[index].createdAt
      };
      payments[index] = updatedPayment;
      
      this.localStorageService.setData(this.STORAGE_KEY, payments);
      this.paymentsSubject.next([...payments]);
      
      return of(updatedPayment);
    }
    
    return of(payment);
  }

  delete(id: string): Observable<void> {
    const payments = this.paymentsSubject.value;
    const filtered = payments.filter(p => p.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.paymentsSubject.next(filtered);
    
    return of(void 0);
  }

  getPaymentsByLoad(loadId: string): Observable<Payment[]> {
    const payments = this.paymentsSubject.value;
    const filtered = payments.filter(p => p.loadId === loadId);
    return of(filtered);
  }

  getPaymentsByParty(partyId: string): Observable<Payment[]> {
    const payments = this.paymentsSubject.value;
    const filtered = payments.filter(p => p.partyId === partyId);
    return of(filtered);
  }

  getPendingPayments(): Observable<Payment[]> {
    // For MVP, consider payments as pending if they're created but not yet fully processed
    // This is a simplified logic - you can enhance it based on your business rules
    const payments = this.paymentsSubject.value;
    const allPayments = payments || [];
    return of(allPayments);
  }
}
