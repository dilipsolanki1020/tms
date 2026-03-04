import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Trip, Vehicle, Driver } from '../../../core/models';
import { TripService } from '../../../core/services/trip.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { DriverService } from '../../../core/services/driver.service';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.css'
})
export class TripFormComponent implements OnInit {
  form: FormGroup;
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  isEdit = false;
  tripId: string | null = null;
  submitLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tripNumber: ['', [Validators.required, Validators.minLength(3)]],
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      sourceLocation: ['', [Validators.required, Validators.minLength(2)]],
      destinationLocation: ['', [Validators.required, Validators.minLength(2)]],
      status: ['Planned', Validators.required],
      totalLoads: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe(
      vehicles => {
        this.vehicles = vehicles;
      },
      error => {
        this.errorMessage = 'Failed to load vehicles';
      }
    );
    
    this.driverService.getAll().subscribe(
      drivers => {
        this.drivers = drivers;
      },
      error => {
        this.errorMessage = 'Failed to load drivers';
      }
    );
    
    this.tripId = this.route.snapshot.paramMap.get('id');
    if (this.tripId) {
      this.isEdit = true;
      this.tripService.getById(this.tripId).subscribe(
        trip => {
          this.form.patchValue(trip);
        },
        error => {
          this.errorMessage = 'Failed to load trip details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const trip: Trip = {
        ...this.form.value,
        loadIds: []
      };
      
      const operation = this.isEdit && this.tripId 
        ? this.tripService.update(this.tripId, trip)
        : this.tripService.create(trip);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/trip']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save trip. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/trip']);
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
      return `${this.fieldLabel(fieldName)} must be greater than or equal to 0`;
    }
    return '';
  }

  private fieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      tripNumber: 'Trip number',
      sourceLocation: 'Source location',
      destinationLocation: 'Destination location'
    };
    return labels[fieldName] || fieldName;
  }
}
