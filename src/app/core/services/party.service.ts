import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Party } from '../models';
import { LocalStorageService } from './local-storage.service';
import { MockDataFactory } from '../models/mock-data.factory';

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private readonly STORAGE_KEY = 'parties';
  private partiesSubject = new BehaviorSubject<Party[]>([]);
  public parties$ = this.partiesSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    let parties = this.localStorageService.getData<Party[]>(this.STORAGE_KEY, []);
    
    if (parties.length === 0) {
      parties = MockDataFactory.getMockParties();
      this.localStorageService.setData(this.STORAGE_KEY, parties);
    }
    
    this.partiesSubject.next(parties);
  }

  private generateId(): string {
    return 'p' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  getAll(): Observable<Party[]> {
    return this.parties$;
  }

  getById(id: string): Observable<Party> {
    const parties = this.partiesSubject.value;
    const party = parties.find(p => p.id === id);
    return of(party!);
  }

  create(party: Party): Observable<Party> {
    const parties = this.partiesSubject.value;
    const newParty: Party = {
      ...party,
      id: party.id || this.generateId(),
      createdAt: new Date()
    };
    
    const updatedParties = [...parties, newParty];
    this.localStorageService.setData(this.STORAGE_KEY, updatedParties);
    this.partiesSubject.next(updatedParties);
    
    return of(newParty);
  }

  update(id: string, party: Party): Observable<Party> {
    const parties = this.partiesSubject.value;
    const index = parties.findIndex(p => p.id === id);
    
    if (index > -1) {
      const updatedParty: Party = {
        ...party,
        id,
        createdAt: parties[index].createdAt,
        updatedAt: new Date()
      };
      parties[index] = updatedParty;
      
      this.localStorageService.setData(this.STORAGE_KEY, parties);
      this.partiesSubject.next([...parties]);
      
      return of(updatedParty);
    }
    
    return of(party);
  }

  delete(id: string): Observable<void> {
    const parties = this.partiesSubject.value;
    const filtered = parties.filter(p => p.id !== id);
    
    this.localStorageService.setData(this.STORAGE_KEY, filtered);
    this.partiesSubject.next(filtered);
    
    return of(void 0);
  }

  getOutstandingParties(): Observable<Party[]> {
    const parties = this.partiesSubject.value;
    const outstanding = parties.filter(p => p.outstandingAmount > 0);
    return of(outstanding);
  }
}
