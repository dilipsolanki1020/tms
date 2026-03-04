import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Load } from '../../../core/models';
import { LoadService } from '../../../core/services/load.service';

@Component({
  selector: 'app-load-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './load-list.component.html',
  styleUrl: './load-list.component.css'
})
export class LoadListComponent implements OnInit {
  loads: Load[] = [];

  constructor(private loadService: LoadService) {}

  ngOnInit(): void {
    this.loadLoads();
  }

  private loadLoads(): void {
    this.loadService.getAll().subscribe(loads => {
      this.loads = loads;
    });
  }

  deleteLoad(id: string | undefined): void {
    if (id && confirm('Are you sure?')) {
      this.loadService.delete(id).subscribe(() => {
        this.loadLoads();
      });
    }
  }
}
