import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Expense, Trip } from '../../../core/models';
import { ExpenseService } from '../../../core/services/expense.service';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {
  form: FormGroup;
  trips: Trip[] = [];
  isEdit = false;
  expenseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tripId: ['', Validators.required],
      type: ['Diesel', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tripService.getAll().subscribe(trips => {
      this.trips = trips;
    });
    
    this.expenseId = this.route.snapshot.paramMap.get('id');
    if (this.expenseId) {
      this.isEdit = true;
      this.expenseService.getById(this.expenseId).subscribe(expense => {
        this.form.patchValue(expense);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const expense: Expense = this.form.value;
      if (this.isEdit && this.expenseId) {
        this.expenseService.update(this.expenseId, expense).subscribe(() => {
          this.router.navigate(['/expense']);
        });
      } else {
        this.expenseService.create(expense).subscribe(() => {
          this.router.navigate(['/expense']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/expense']);
  }
}
