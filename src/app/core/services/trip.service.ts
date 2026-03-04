import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Trip } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly STORAGE_KEY = 'trips';
  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  public trips$ = this.tripsSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let trips = this.localStorageService.getData<Trip[]>(this.STORAGE_KEY, []);
    
    if (trips.length === 0) {
      trips = MockDataFactory.getMockTrips();
      this.localStorageService.setData(this.STORAGE_KEY, trips);
    }
    
    this.tripsSubject.next(trips);
  }

  private generateId(): string {
    return 't' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Trip[]> {
    return this.trips$;
  }

  getById(id: string): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const trip = trips.find(t => t.id === id);
    return of(trip!);
  }

  create(trip: Trip): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const newTrip: Trip = {
      ...trip,
      id: trip.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedTrips = [...trips, newTrip];
    this.localStorageService.setData(this.STORAGE_KEY, updatedTrips);
    this.tripsSubject.next(updatedTrips);
    
    return of(newTrip);
  }

  update(id: string, trip: Trip): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const index = trips.findIndex(t => t.id === id);
    
    if (index > -1) {
      const updatedTrip: Trip = {
        ...trip,
        id,
        createdAt: trips[index].createdAt
      };
      trips[index] = updatedTrip;
      
      this.localStorageService.setData(this.STORAGE_KEY, trips);
      this.tripsSubject.next([...trips]);
      
      return of(updatedTrip);
    }
    
    return of(trip);
  }

  delete(id: string): Observable<void> {
    const trips = this.tripsSubject.value;
    const filtered = trips.filter(t => t.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.tripsSubject.next(filtered);
    
    return of(void 0);
  }

  updateStatus(id: string, status: string): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const index = trips.findIndex(t => t.id === id);
    
    if (index > -1) {
      const updatedTrip: Trip = {
        ...trips[index],
        status: status as 'Planned' | 'In Progress' | 'Completed'
      };
      trips[index] = updatedTrip;
      
      this.localStorageService.setData(this.STORAGE_KEY, trips);
      this.tripsSubject.next([...trips]);
      
      return of(updatedTrip);
    }
    
    return of(trips[index]);
  }

  recordDeparture(id: string): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const index = trips.findIndex(t => t.id === id);
    
    if (index > -1) {
      const updatedTrip: Trip = {
        ...trips[index],
        departureTime: new Date(),
        status: 'In Progress'
      };
      trips[index] = updatedTrip;
      
      this.localStorageService.setData(this.STORAGE_KEY, trips);
      this.tripsSubject.next([...trips]);
      
      return of(updatedTrip);
    }
    
    return of(trips[index]);
  }

  recordArrival(id: string): Observable<Trip> {
    const trips = this.tripsSubject.value;
    const index = trips.findIndex(t => t.id === id);
    
    if (index > -1) {
      const updatedTrip: Trip = {
        ...trips[index],
        arrivalTime: new Date(),
        status: 'Completed'
      };
      trips[index] = updatedTrip;
      
      this.localStorageService.setData(this.STORAGE_KEY, trips);
      this.tripsSubject.next([...trips]);
      
      return of(updatedTrip);
    }
    
    return of(trips[index]);
  }

  getTripsByStatus(status: string): Observable<Trip[]> {
    const trips = this.tripsSubject.value;
    const filtered = trips.filter(t => t.status === status);
    return of(filtered);
  }
}
