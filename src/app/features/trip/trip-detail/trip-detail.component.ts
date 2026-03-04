import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="container"><h1>Trip Detail</h1><p>Trip detail component</p><a routerLink="/trip" class="btn btn-secondary">← Back</a></div>`,
  styles: [`.container { padding: 2rem; }`]
})
export class TripDetailComponent {}
