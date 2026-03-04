import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../core/models';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})
export class VehicleFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  vehicleId: string | null = null;
  submitLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      vehicleType: ['Truck', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      owner: ['Owned', Validators.required],
      availabilityStatus: ['Available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.isEdit = true;
      this.vehicleService.getById(this.vehicleId).subscribe(
        vehicle => {
          this.form.patchValue(vehicle);
        },
        error => {
          this.errorMessage = 'Failed to load vehicle details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const vehicle: Vehicle = this.form.value;
      
      const operation = this.isEdit && this.vehicleId 
        ? this.vehicleService.update(this.vehicleId, vehicle)
        : this.vehicleService.create(vehicle);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/vehicle']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save vehicle. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicle']);
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
    if (field?.hasError('maxLength')) {
      const maxLength = field.getError('maxLength').requiredLength;
      return `${this.fieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${this.fieldLabel(fieldName)} must be at least 1`;
    }
    if (field?.hasError('max')) {
      return `${this.fieldLabel(fieldName)} cannot exceed 100 tonnes`;
    }
    return '';
  }

  private fieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      registrationNumber: 'Registration number',
      capacity: 'Capacity'
    };
    return labels[fieldName] || fieldName;
  }
}
