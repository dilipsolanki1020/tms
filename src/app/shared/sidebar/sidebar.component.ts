import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Parties', icon: '👥', route: '/party' },
    { label: 'Loads', icon: '📦', route: '/load' },
    { label: 'Vehicles', icon: '🚚', route: '/vehicle' },
    { label: 'Trips', icon: '🗺️', route: '/trip' },
    { label: 'Expenses', icon: '🧾', route: '/expense' },
    { label: 'Payments', icon: '💳', route: '/payment' },
    { label: 'Reports', icon: '📄', route: '/report' }
  ];
}
