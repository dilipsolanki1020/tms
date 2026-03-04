import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Load } from '../../../core/models';
import { LoadService } from '../../../core/services/load.service';

@Component({
  selector: 'app-load-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './load-form.component.html',
  styleUrl: './load-form.component.css'
})
export class LoadFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  loadId: string | null = null;
  submitLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loadService: LoadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      loadNumber: ['', [Validators.required, Validators.minLength(3)]],
      loadType: ['FTL', Validators.required],
      status: ['Created', Validators.required],
      sourceLocation: ['', [Validators.required, Validators.minLength(2)]],
      destinationLocation: ['', [Validators.required, Validators.minLength(2)]],
      freightAmount: ['', [Validators.required, Validators.min(1), Validators.max(10000000)]]
    });
  }

  ngOnInit(): void {
    this.loadId = this.route.snapshot.paramMap.get('id');
    if (this.loadId) {
      this.isEdit = true;
      this.loadService.getById(this.loadId).subscribe(
        load => {
          this.form.patchValue(load);
        },
        error => {
          this.errorMessage = 'Failed to load details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const load: Load = {
        ...this.form.value,
        consignments: []
      };
      
      const operation = this.isEdit && this.loadId 
        ? this.loadService.update(this.loadId, load)
        : this.loadService.create(load);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/load']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save load. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/load']);
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
      loadNumber: 'Load number',
      sourceLocation: 'Source location',
      destinationLocation: 'Destination location',
      freightAmount: 'Freight amount'
    };
    return labels[fieldName] || fieldName;
  }
}
