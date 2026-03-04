import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-load-detail',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="container"><h1>Load Detail</h1><p>Load detail component</p><a routerLink="/load" class="btn btn-secondary">← Back</a></div>`,
  styles: [`.container { padding: 2rem; }`]
})
export class LoadDetailComponent {}
