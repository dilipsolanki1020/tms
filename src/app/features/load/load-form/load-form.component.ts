import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Load } from '../../../core/models';
import { LoadService } from '../../../core/services/load.service';

@Component({
  selector: 'app-load-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './load-form.component.html',
  styleUrl: './load-form.component.css'
})
export class LoadFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  loadId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loadService: LoadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      loadNumber: ['', Validators.required],
      loadType: ['FTL', Validators.required],
      status: ['Created', Validators.required],
      sourceLocation: ['', Validators.required],
      destinationLocation: ['', Validators.required],
      freightAmount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadId = this.route.snapshot.paramMap.get('id');
    if (this.loadId) {
      this.isEdit = true;
      this.loadService.getById(this.loadId).subscribe(load => {
        this.form.patchValue(load);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const load: Load = this.form.value;
      if (this.isEdit && this.loadId) {
        this.loadService.update(this.loadId, load).subscribe(() => {
          this.router.navigate(['/load']);
        });
      } else {
        this.loadService.create(load).subscribe(() => {
          this.router.navigate(['/load']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/load']);
  }
}
