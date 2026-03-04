import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Driver } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private readonly STORAGE_KEY = 'drivers';
  private driversSubject = new BehaviorSubject<Driver[]>([]);
  public drivers$ = this.driversSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let drivers = this.localStorageService.getData<Driver[]>(this.STORAGE_KEY, []);
    
    if (drivers.length === 0) {
      drivers = MockDataFactory.getMockDrivers();
      this.localStorageService.setData(this.STORAGE_KEY, drivers);
    }
    
    this.driversSubject.next(drivers);
  }

  private generateId(): string {
    return 'd' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Driver[]> {
    return this.drivers$;
  }

  getById(id: string): Observable<Driver> {
    const drivers = this.driversSubject.value;
    const driver = drivers.find(d => d.id === id);
    return of(driver!);
  }

  create(driver: Driver): Observable<Driver> {
    const drivers = this.driversSubject.value;
    const newDriver: Driver = {
      ...driver,
      id: driver.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedDrivers = [...drivers, newDriver];
    this.localStorageService.setData(this.STORAGE_KEY, updatedDrivers);
    this.driversSubject.next(updatedDrivers);
    
    return of(newDriver);
  }

  update(id: string, driver: Driver): Observable<Driver> {
    const drivers = this.driversSubject.value;
    const index = drivers.findIndex(d => d.id === id);
    
    if (index > -1) {
      const updatedDriver: Driver = {
        ...driver,
        id,
        createdAt: drivers[index].createdAt,
        updatedAt: new Date()
      };
      drivers[index] = updatedDriver;
      
      this.localStorageService.setData(this.STORAGE_KEY, drivers);
      this.driversSubject.next([...drivers]);
      
      return of(updatedDriver);
    }
    
    return of(driver);
  }

  delete(id: string): Observable<void> {
    const drivers = this.driversSubject.value;
    const filtered = drivers.filter(d => d.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.driversSubject.next(filtered);
    
    return of(void 0);
  }
}
