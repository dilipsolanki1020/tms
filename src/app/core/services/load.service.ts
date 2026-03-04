import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Load } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class LoadService {
  private readonly STORAGE_KEY = 'loads';
  private loadsSubject = new BehaviorSubject<Load[]>([]);
  public loads$ = this.loadsSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let loads = this.localStorageService.getData<Load[]>(this.STORAGE_KEY, []);
    
    if (loads.length === 0) {
      loads = MockDataFactory.getMockLoads();
      this.localStorageService.setData(this.STORAGE_KEY, loads);
    }
    
    this.loadsSubject.next(loads);
  }

  private generateId(): string {
    return 'l' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  private generateLRNumber(): string {
    return 'LR-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }

  getAll(): Observable<Load[]> {
    return this.loads$;
  }

  getById(id: string): Observable<Load> {
    const loads = this.loadsSubject.value;
    const load = loads.find(l => l.id === id);
    return of(load!);
  }

  create(load: Load): Observable<Load> {
    const loads = this.loadsSubject.value;
    const newLoad: Load = {
      ...load,
      id: load.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedLoads = [...loads, newLoad];
    this.localStorageService.setData(this.STORAGE_KEY, updatedLoads);
    this.loadsSubject.next(updatedLoads);
    
    return of(newLoad);
  }

  update(id: string, load: Load): Observable<Load> {
    const loads = this.loadsSubject.value;
    const index = loads.findIndex(l => l.id === id);
    
    if (index > -1) {
      const updatedLoad: Load = {
        ...load,
        id,
        createdAt: loads[index].createdAt
      };
      loads[index] = updatedLoad;
      
      this.localStorageService.setData(this.STORAGE_KEY, loads);
      this.loadsSubject.next([...loads]);
      
      return of(updatedLoad);
    }
    
    return of(load);
  }

  delete(id: string): Observable<void> {
    const loads = this.loadsSubject.value;
    const filtered = loads.filter(l => l.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.loadsSubject.next(filtered);
    
    return of(void 0);
  }

  generateLR(loadId: string): Observable<string> {
    const loads = this.loadsSubject.value;
    const index = loads.findIndex(l => l.id === loadId);
    
    if (index > -1) {
      const lrNumber = this.generateLRNumber();
      const updatedLoad: Load = {
        ...loads[index],
        generatedLRs: [...(loads[index].generatedLRs || []), lrNumber]
      };
      loads[index] = updatedLoad;
      
      this.localStorageService.setData(this.STORAGE_KEY, loads);
      this.loadsSubject.next([...loads]);
      
      return of(lrNumber);
    }
    
    return of('');
  }

  updateStatus(id: string, status: string): Observable<Load> {
    const loads = this.loadsSubject.value;
    const index = loads.findIndex(l => l.id === id);
    
    if (index > -1) {
      const updatedLoad: Load = {
        ...loads[index],
        status: status as 'Created' | 'Loaded' | 'In Transit' | 'Delivered' | 'Closed'
      };
      
      // Set timestamps based on status
      if (status === 'Loaded') {
        updatedLoad.loadedAt = new Date();
      } else if (status === 'Delivered') {
        updatedLoad.deliveredAt = new Date();
      } else if (status === 'Closed') {
        updatedLoad.closedAt = new Date();
      }
      
      loads[index] = updatedLoad;
      
      this.localStorageService.setData(this.STORAGE_KEY, loads);
      this.loadsSubject.next([...loads]);
      
      return of(updatedLoad);
    }
    
    return of(loads[index]);
  }

  getLoadsByStatus(status: string): Observable<Load[]> {
    const loads = this.loadsSubject.value;
    const filtered = loads.filter(l => l.status === status);
    return of(filtered);
  }
}
