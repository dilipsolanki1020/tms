import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, Expense, Payment, Load } from '../../../core/models';
import { TripService } from '../../../core/services/trip.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { PaymentService } from '../../../core/services/payment.service';
import { LoadService } from '../../../core/services/load.service';
import { FinanceService } from '../../../core/services/finance.service';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-dashboard.component.html',
  styleUrl: './report-dashboard.component.css'
})
export class ReportDashboardComponent implements OnInit {
  trips: Trip[] = [];
  loads: Load[] = [];
  expenses: Expense[] = [];
  payments: Payment[] = [];

  reports = {
    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    completedTrips: 0,
    activeLoads: 0,
    expenseBreakdown: {
      diesel: 0,
      toll: 0,
      advance: 0,
      other: 0
    },
    profitByLoadType: {
      FTL: 0,
      PTL: 0
    }
  };

  constructor(
    private tripService: TripService,
    private expenseService: ExpenseService,
    private paymentService: PaymentService,
    private loadService: LoadService,
    private financeService: FinanceService
  ) {}

  ngOnInit(): void {
    this.generateReports();
  }

  private generateReports(): void {
    // Get all data
    this.tripService.getAll().subscribe(trips => {
      this.trips = trips;
      this.calculateReports();
    });

    this.loadService.getAll().subscribe(loads => {
      this.loads = loads;
      this.calculateReports();
    });

    this.expenseService.getAll().subscribe(expenses => {
      this.expenses = expenses;
      this.calculateReports();
    });

    this.paymentService.getAll().subscribe(payments => {
      this.payments = payments;
      this.calculateReports();
    });
  }

  private calculateReports(): void {
    // Total Revenue
    this.reports.totalRevenue = this.loads.reduce((sum, load) => sum + load.freightAmount, 0);

    // Total Expense
    this.reports.totalExpense = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Net Profit
    this.reports.netProfit = this.reports.totalRevenue - this.reports.totalExpense;

    // Completed Trips
    this.reports.completedTrips = this.trips.filter(t => t.status === 'Completed').length;

    // Active Loads
    this.reports.activeLoads = this.loads.filter(l => l.status !== 'Closed' && l.status !== 'Delivered').length;

    // Expense Breakdown
    this.reports.expenseBreakdown = {
      diesel: this.expenses.filter(e => e.type === 'Diesel').reduce((sum, e) => sum + e.amount, 0),
      toll: this.expenses.filter(e => e.type === 'Toll').reduce((sum, e) => sum + e.amount, 0),
      advance: this.expenses.filter(e => e.type === 'Advance').reduce((sum, e) => sum + e.amount, 0),
      other: this.expenses.filter(e => e.type === 'Other').reduce((sum, e) => sum + e.amount, 0)
    };

    // Profit by Load Type
    const ftlLoads = this.loads.filter(l => l.loadType === 'FTL');
    const ptlLoads = this.loads.filter(l => l.loadType === 'PTL');
    
    this.reports.profitByLoadType = {
      FTL: ftlLoads.reduce((sum, l) => sum + l.freightAmount, 0),
      PTL: ptlLoads.reduce((sum, l) => sum + l.freightAmount, 0)
    };
  }
}
