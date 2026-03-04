import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
export class PartyFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  partyId: string | null = null;
  submitLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private partyService: PartyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['Company', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['Maharashtra', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.pattern(/^[0-9\-\s]*$/)]],
      creditLimit: ['', [Validators.required, Validators.min(0)]],
      outstandingAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.partyId = this.route.snapshot.paramMap.get('id');
    if (this.partyId) {
      this.isEdit = true;
      this.partyService.getById(this.partyId).subscribe(
        party => {
          this.form.patchValue(party);
        },
        error => {
          this.errorMessage = 'Failed to load party details';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitLoading = true;
      this.errorMessage = '';
      const party: Party = this.form.value;
      
      const operation = this.isEdit && this.partyId 
        ? this.partyService.update(this.partyId, party)
        : this.partyService.create(party);
      
      operation.subscribe(
        () => {
          this.submitLoading = false;
          this.router.navigate(['/party']);
        },
        error => {
          this.submitLoading = false;
          this.errorMessage = 'Failed to save party. Please try again.';
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/party']);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.fieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minLength')) {
      const minLength = field.getError('minLength').requiredLength;
      return `${this.fieldLabel(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (fieldName === 'zipCode') {
        return 'Zip code can only contain numbers, hyphens, and spaces';
      }
    }
    if (field?.hasError('min')) {
      return `${this.fieldLabel(fieldName)} must be greater than or equal to 0`;
    }
    return '';
  }

  private fieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Party name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'Zip code',
      creditLimit: 'Credit limit'
    };
    return labels[fieldName] || fieldName;
  }
}
