import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Vehicle } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly STORAGE_KEY = 'vehicles';
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);
  public vehicles$ = this.vehiclesSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let vehicles = this.localStorageService.getData<Vehicle[]>(this.STORAGE_KEY, []);
    
    if (vehicles.length === 0) {
      vehicles = MockDataFactory.getMockVehicles();
      this.localStorageService.setData(this.STORAGE_KEY, vehicles);
    }
    
    this.vehiclesSubject.next(vehicles);
  }

  private generateId(): string {
    return 'v' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Vehicle[]> {
    return this.vehicles$;
  }

  getById(id: string): Observable<Vehicle> {
    const vehicles = this.vehiclesSubject.value;
    const vehicle = vehicles.find(v => v.id === id);
    return of(vehicle!);
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    const vehicles = this.vehiclesSubject.value;
    const newVehicle: Vehicle = {
      ...vehicle,
      id: vehicle.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedVehicles = [...vehicles, newVehicle];
    this.localStorageService.setData(this.STORAGE_KEY, updatedVehicles);
    this.vehiclesSubject.next(updatedVehicles);
    
    return of(newVehicle);
  }

  update(id: string, vehicle: Vehicle): Observable<Vehicle> {
    const vehicles = this.vehiclesSubject.value;
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index > -1) {
      const updatedVehicle: Vehicle = {
        ...vehicle,
        id,
        createdAt: vehicles[index].createdAt,
        updatedAt: new Date()
      };
      vehicles[index] = updatedVehicle;
      
      this.localStorageService.setData(this.STORAGE_KEY, vehicles);
      this.vehiclesSubject.next([...vehicles]);
      
      return of(updatedVehicle);
    }
    
    return of(vehicle);
  }

  delete(id: string): Observable<void> {
    const vehicles = this.vehiclesSubject.value;
    const filtered = vehicles.filter(v => v.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.vehiclesSubject.next(filtered);
    
    return of(void 0);
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    const vehicles = this.vehiclesSubject.value;
    const available = vehicles.filter(v => v.availabilityStatus === 'Available');
    return of(available);
  }

  updateAvailability(id: string, status: string): Observable<Vehicle> {
    const vehicles = this.vehiclesSubject.value;
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index > -1) {
      const updatedVehicle: Vehicle = {
        ...vehicles[index],
        availabilityStatus: status as 'Available' | 'In Transit' | 'Under Maintenance',
        updatedAt: new Date()
      };
      vehicles[index] = updatedVehicle;
      
      this.localStorageService.setData(this.STORAGE_KEY, vehicles);
      this.vehiclesSubject.next([...vehicles]);
      
      return of(updatedVehicle);
    }
    
    return of(vehicles[index]);
  }
}
