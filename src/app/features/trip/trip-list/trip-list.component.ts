import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Trip } from '../../../core/models';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css'
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  private loadTrips(): void {
    this.tripService.getAll().subscribe(trips => {
      this.trips = trips;
    });
  }

  deleteTrip(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.tripService.delete(id).subscribe(() => {
        this.loadTrips();
      });
    }
  }

  getBadgeClass(status: string): string {
    return 'badge-' + status.toLowerCase().replace(/ /g, '-');
  }
}
