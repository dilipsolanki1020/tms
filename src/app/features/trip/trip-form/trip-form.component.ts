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

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tripNumber: ['', Validators.required],
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      sourceLocation: ['', Validators.required],
      destinationLocation: ['', Validators.required],
      status: ['Planned', Validators.required],
      totalLoads: [0]
    });
  }

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
    
    this.driverService.getAll().subscribe(drivers => {
      this.drivers = drivers;
    });
    
    this.tripId = this.route.snapshot.paramMap.get('id');
    if (this.tripId) {
      this.isEdit = true;
      this.tripService.getById(this.tripId).subscribe(trip => {
        this.form.patchValue(trip);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const trip: Trip = this.form.value;
      if (this.isEdit && this.tripId) {
        this.tripService.update(this.tripId, trip).subscribe(() => {
          this.router.navigate(['/trip']);
        });
      } else {
        this.tripService.create(trip).subscribe(() => {
          this.router.navigate(['/trip']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/trip']);
  }
}
