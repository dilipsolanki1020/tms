import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Party, Load, Vehicle, Trip } from '../../core/models';
import { PartyService } from '../../core/services/party.service';
import { LoadService } from '../../core/services/load.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { TripService } from '../../core/services/trip.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  parties: Party[] = [];
  loads: Load[] = [];
  vehicles: Vehicle[] = [];
  trips: Trip[] = [];

  stats = {
    totalParties: 0,
    activeLoads: 0,
    totalVehicles: 0,
    completedTrips: 0
  };

  constructor(
    private partyService: PartyService,
    private loadService: LoadService,
    private vehicleService: VehicleService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.partyService.getAll().subscribe(parties => {
      this.parties = parties;
      this.stats.totalParties = parties.length;
    });

    this.loadService.getAll().subscribe(loads => {
      this.loads = loads;
      this.stats.activeLoads = loads.filter(l => l.status !== 'Closed').length;
    });

    this.vehicleService.getAll().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.stats.totalVehicles = vehicles.length;
    });

    this.tripService.getAll().subscribe(trips => {
      this.trips = trips;
      this.stats.completedTrips = trips.filter(t => t.status === 'Completed').length;
    });
  }
}
