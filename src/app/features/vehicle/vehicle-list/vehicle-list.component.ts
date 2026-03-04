import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../core/models';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {
    this.vehicleService.getAll().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

  deleteVehicle(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.vehicleService.delete(id).subscribe(() => {
        this.loadVehicles();
      });
    }
  }

  getBadgeClass(status: string): string {
    return 'badge-' + status.toLowerCase().replace(/ /g, '-');
  }
}
