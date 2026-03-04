import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expense } from '../../../core/models';
import { ExpenseService } from '../../../core/services/expense.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    this.expenseService.getAll().subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  deleteExpense(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.expenseService.delete(id).subscribe(() => {
        this.loadExpenses();
      });
    }
  }
}
