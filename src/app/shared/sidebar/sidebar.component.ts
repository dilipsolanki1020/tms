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
    { label: 'Party Management', icon: '👥', route: '/party' },
    { label: 'Load Management', icon: '📦', route: '/load' },
    { label: 'Vehicle Management', icon: '🚚', route: '/vehicle' },
    { label: 'Trip Management', icon: '🗺️', route: '/trip' },
    { label: 'Expense Tracking', icon: '🧾', route: '/expense' },
    { label: 'Payment Management', icon: '💳', route: '/payment' },
    { label: 'Reports', icon: '📄', route: '/report' }
  ];
}
