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

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      registrationNumber: ['', Validators.required],
      vehicleType: ['Truck', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      owner: ['Owned', Validators.required],
      availabilityStatus: ['Available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (this.vehicleId) {
      this.isEdit = true;
      this.vehicleService.getById(this.vehicleId).subscribe(vehicle => {
        this.form.patchValue(vehicle);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const vehicle: Vehicle = this.form.value;
      if (this.isEdit && this.vehicleId) {
        this.vehicleService.update(this.vehicleId, vehicle).subscribe(() => {
          this.router.navigate(['/vehicle']);
        });
      } else {
        this.vehicleService.create(vehicle).subscribe(() => {
          this.router.navigate(['/vehicle']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicle']);
  }
}
