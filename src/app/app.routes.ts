import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'party',
    loadComponent: () => import('./features/party/party-list/party-list.component').then(m => m.PartyListComponent)
  },
  {
    path: 'party/create',
    loadComponent: () => import('./features/party/party-form/party-form.component').then(m => m.PartyFormComponent)
  },
  {
    path: 'party/:id',
    loadComponent: () => import('./features/party/party-detail/party-detail.component').then(m => m.PartyDetailComponent)
  },
  {
    path: 'load',
    loadComponent: () => import('./features/load/load-list/load-list.component').then(m => m.LoadListComponent)
  },
  {
    path: 'load/create',
    loadComponent: () => import('./features/load/load-form/load-form.component').then(m => m.LoadFormComponent)
  },
  {
    path: 'load/:id',
    loadComponent: () => import('./features/load/load-detail/load-detail.component').then(m => m.LoadDetailComponent)
  },
  {
    path: 'vehicle',
    loadComponent: () => import('./features/vehicle/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent)
  },
  {
    path: 'vehicle/create',
    loadComponent: () => import('./features/vehicle/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent)
  },
  {
    path: 'vehicle/:id',
    loadComponent: () => import('./features/vehicle/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent)
  },
  {
    path: 'trip',
    loadComponent: () => import('./features/trip/trip-list/trip-list.component').then(m => m.TripListComponent)
  },
  {
    path: 'trip/create',
    loadComponent: () => import('./features/trip/trip-form/trip-form.component').then(m => m.TripFormComponent)
  },
  {
    path: 'trip/:id',
    loadComponent: () => import('./features/trip/trip-detail/trip-detail.component').then(m => m.TripDetailComponent)
  },
  {
    path: 'expense',
    loadComponent: () => import('./features/expense/expense-list/expense-list.component').then(m => m.ExpenseListComponent)
  },
  {
    path: 'expense/create',
    loadComponent: () => import('./features/expense/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
  },
  {
    path: 'expense/:id',
    loadComponent: () => import('./features/expense/expense-detail/expense-detail.component').then(m => m.ExpenseDetailComponent)
  },
  {
    path: 'payment',
    loadComponent: () => import('./features/payment/payment-list/payment-list.component').then(m => m.PaymentListComponent)
  },
  {
    path: 'payment/create',
    loadComponent: () => import('./features/payment/payment-form/payment-form.component').then(m => m.PaymentFormComponent)
  },
  {
    path: 'report',
    loadComponent: () => import('./features/report/report-dashboard/report-dashboard.component').then(m => m.ReportDashboardComponent)
  }
];
