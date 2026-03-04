import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Party } from '../../../core/models';
import { PartyService } from '../../../core/services/party.service';

@Component({
  selector: 'app-party-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.css'
})
export class PartyListComponent implements OnInit {
  parties: Party[] = [];

  constructor(private partyService: PartyService) {}

  ngOnInit(): void {
    this.loadParties();
  }

  private loadParties(): void {
    this.partyService.getAll().subscribe(parties => {
      this.parties = parties;
    });
  }

  deleteParty(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.partyService.delete(id).subscribe(() => {
        this.loadParties();
      });
    }
  }
}
