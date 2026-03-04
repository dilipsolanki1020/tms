import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../core/models';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getById(id).subscribe(vehicle => {
        this.vehicle = vehicle;
      });
    }
  }

  getBadgeClass(status: string): string {
    return 'badge-' + status.toLowerCase().replace(/ /g, '-');
  }
}
