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
  submitLoading = false;
  errorMessage = '';

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
      amount: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.tripService.getAll().subscribe(
      trips => {
        this.trips = trips;
      },
      error => {
        this.errorMessage = 'Failed to load trips';
      }
    );
    
    this.expenseId = this.route.snapshot.paramMap.get('id');
    if (this.expenseId) {
      this.isEdit = true;
      this.expenseService.getById(this.expenseId).subscribe(
        expense => {
          this.form.patchValue(expense);
        },
        error => {
          this.errorMessage = 'Failed to load expense details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const expense: Expense = this.form.value;
      
      const operation = this.isEdit && this.expenseId 
        ? this.expenseService.update(this.expenseId, expense)
        : this.expenseService.create(expense);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/expense']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save expense. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/expense']);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.fieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('minLength')) {
      const minLength = field.getError('minLength').requiredLength;
      return `${this.fieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${this.fieldLabel(fieldName)} must be greater than 0`;
    }
    if (field?.hasError('max')) {
      return `${this.fieldLabel(fieldName)} is too high`;
    }
    return '';
  }

  private fieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      amount: 'Amount',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }
}
