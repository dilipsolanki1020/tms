import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Party } from '../../../core/models';
import { PartyService } from '../../../core/services/party.service';

@Component({
  selector: 'app-party-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './party-form.component.html',
  styleUrl: './party-form.component.css'
})
export class PartyFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private partyService: PartyService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['Company', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['Maharashtra', Validators.required],
      zipCode: [''],
      creditLimit: ['', Validators.required],
      outstandingAmount: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const party: Party = this.form.value;
      this.partyService.create(party).subscribe(() => {
        this.router.navigate(['/party']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/party']);
  }
}
