import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="container"><h1>Expense Detail</h1><p>Expense detail component</p><a routerLink="/expense" class="btn btn-secondary">← Back</a></div>`,
  styles: [`.container { padding: 2rem; }`]
})
export class ExpenseDetailComponent {}
