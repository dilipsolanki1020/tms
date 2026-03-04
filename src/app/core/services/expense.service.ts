import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Expense } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly STORAGE_KEY = 'expenses';
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let expenses = this.localStorageService.getData<Expense[]>(this.STORAGE_KEY, []);
    
    if (expenses.length === 0) {
      expenses = MockDataFactory.getMockExpenses();
      this.localStorageService.setData(this.STORAGE_KEY, expenses);
    }
    
    this.expensesSubject.next(expenses);
  }

  private generateId(): string {
    return 'e' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Expense[]> {
    return this.expenses$;
  }

  getById(id: string): Observable<Expense> {
    const expenses = this.expensesSubject.value;
    const expense = expenses.find(e => e.id === id);
    return of(expense!);
  }

  create(expense: Expense): Observable<Expense> {
    const expenses = this.expensesSubject.value;
    const newExpense: Expense = {
      ...expense,
      id: expense.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedExpenses = [...expenses, newExpense];
    this.localStorageService.setData(this.STORAGE_KEY, updatedExpenses);
    this.expensesSubject.next(updatedExpenses);
    
    return of(newExpense);
  }

  update(id: string, expense: Expense): Observable<Expense> {
    const expenses = this.expensesSubject.value;
    const index = expenses.findIndex(e => e.id === id);
    
    if (index > -1) {
      const updatedExpense: Expense = {
        ...expense,
        id,
        createdAt: expenses[index].createdAt
      };
      expenses[index] = updatedExpense;
      
      this.localStorageService.setData(this.STORAGE_KEY, expenses);
      this.expensesSubject.next([...expenses]);
      
      return of(updatedExpense);
    }
    
    return of(expense);
  }

  delete(id: string): Observable<void> {
    const expenses = this.expensesSubject.value;
    const filtered = expenses.filter(e => e.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.expensesSubject.next(filtered);
    
    return of(void 0);
  }

  getExpensesByTrip(tripId: string): Observable<Expense[]> {
    const expenses = this.expensesSubject.value;
    const filtered = expenses.filter(e => e.tripId === tripId);
    return of(filtered);
  }

  getTotalExpenseByTrip(tripId: string): Observable<number> {
    const expenses = this.expensesSubject.value;
    const total = expenses
      .filter(e => e.tripId === tripId)
      .reduce((sum, e) => sum + e.amount, 0);
    return of(total);
  }
}
