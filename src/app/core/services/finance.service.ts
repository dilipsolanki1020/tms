import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TripFinance } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';
import { TripService } from './trip.service';
import { ExpenseService } from './expense.service';
import { LoadService } from './load.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private readonly STORAGE_KEY = 'tripFinances';

  constructor(
    private localStorageService: LocalStorageService,
    private tripService: TripService,
    private expenseService: ExpenseService,
    private loadService: LoadService
  ) {
    this.initializeData();
  }

  private initializeData(): void {
    let finances = this.localStorageService.getData<TripFinance[]>(this.STORAGE_KEY, []);
    
    if (finances.length === 0) {
      finances = MockDataFactory.getMockTripFinances();
      this.localStorageService.setData(this.STORAGE_KEY, finances);
    }
  }

  calculateTripProfit(tripId: string): Observable<TripFinance> {
    const finances = this.localStorageService.getData<TripFinance[]>(this.STORAGE_KEY, []);
    
    // Get trip data to find associated loads
    const trips = this.tripService['tripsSubject'].value || [];
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
      return of({
        tripId,
        totalRevenue: 0,
        totalExpense: 0,
        profit: 0,
        isProfitCalculated: false,
        paymentStatus: 'Pending'
      });
    }

    // Calculate revenue from loads
    const loads = this.loadService['loadsSubject'].value || [];
    const tripLoads = loads.filter(l => trip.loadIds && trip.loadIds.includes(l.id!));
    const totalRevenue = tripLoads.reduce((sum, load) => sum + load.freightAmount, 0);

    // Calculate expenses
    const expenses = this.expenseService['expensesSubject'].value || [];
    const tripExpenses = expenses.filter(e => e.tripId === tripId);
    const totalExpense = tripExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate profit
    const profit = totalRevenue - totalExpense;
    
    const tripFinance: TripFinance = {
      tripId,
      totalRevenue,
      totalExpense,
      profit,
      isProfitCalculated: true,
      paymentStatus: profit >= 0 ? 'Completed' : 'Partial'
    };

    // Store the calculated finance
    const existingIndex = finances.findIndex(f => f.tripId === tripId);
    if (existingIndex > -1) {
      finances[existingIndex] = tripFinance;
    } else {
      finances.push(tripFinance);
    }
    
    this.localStorageService.setData(this.STORAGE_KEY, finances);
    return of(tripFinance);
  }

  getTripFinance(tripId: string): Observable<TripFinance> {
    const finances = this.localStorageService.getData<TripFinance[]>(this.STORAGE_KEY, []);
    const finance = finances.find(f => f.tripId === tripId);
    
    if (finance) {
      return of(finance);
    }
    
    // If not found, calculate it
    return this.calculateTripProfit(tripId);
  }

  getAllFinanceData(): Observable<TripFinance[]> {
    const finances = this.localStorageService.getData<TripFinance[]>(this.STORAGE_KEY, []);
    return of(finances);
  }

  getRevenueForPeriod(startDate: Date, endDate: Date): Observable<number> {
    const loads = this.loadService['loadsSubject'].value || [];
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const totalRevenue = loads
      .filter(load => {
        const loadDate = new Date(load.createdAt || new Date()).getTime();
        return loadDate >= start && loadDate <= end;
      })
      .reduce((sum, load) => sum + load.freightAmount, 0);

    return of(totalRevenue);
  }

  getProfitForPeriod(startDate: Date, endDate: Date): Observable<number> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const loads = this.loadService['loadsSubject'].value || [];
    const expenses = this.expenseService['expensesSubject'].value || [];

    const totalRevenue = loads
      .filter(load => {
        const loadDate = new Date(load.createdAt || new Date()).getTime();
        return loadDate >= start && loadDate <= end;
      })
      .reduce((sum, load) => sum + load.freightAmount, 0);

    const totalExpense = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.createdAt || new Date()).getTime();
        return expenseDate >= start && expenseDate <= end;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const profit = totalRevenue - totalExpense;
    return of(profit);
  }

  getExpenseForPeriod(startDate: Date, endDate: Date): Observable<number> {
    const expenses = this.expenseService['expensesSubject'].value || [];
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const totalExpense = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.createdAt || new Date()).getTime();
        return expenseDate >= start && expenseDate <= end;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return of(totalExpense);
  }

  getProfitByLoadType(startDate: Date, endDate: Date): Observable<any> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const loads = this.loadService['loadsSubject'].value || [];
    const expenses = this.expenseService['expensesSubject'].value || [];

    const profitByType: { [key: string]: number } = {};

    loads
      .filter(load => {
        const loadDate = new Date(load.createdAt || new Date()).getTime();
        return loadDate >= start && loadDate <= end;
      })
      .forEach(load => {
        if (!profitByType[load.loadType]) {
          profitByType[load.loadType] = 0;
        }
        profitByType[load.loadType] += load.freightAmount;
      });

    // Subtract average expenses per load type
    expenses.forEach(expense => {
      // Simplified: distribute expenses equally if we can't trace to load type
      Object.keys(profitByType).forEach(type => {
        profitByType[type] -= expense.amount / Object.keys(profitByType).length;
      });
    });

    return of(profitByType);
  }
}
