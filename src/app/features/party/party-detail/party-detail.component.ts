import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Party } from '../../../core/models';
import { PartyService } from '../../../core/services/party.service';

@Component({
  selector: 'app-party-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './party-detail.component.html',
  styleUrl: './party-detail.component.css'
})
export class PartyDetailComponent implements OnInit {
  party: Party | null = null;

  constructor(
    private route: ActivatedRoute,
    private partyService: PartyService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.partyService.getById(id).subscribe(party => {
        this.party = party;
      });
    }
  }
}
