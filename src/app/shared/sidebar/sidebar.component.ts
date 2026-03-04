import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Party Management', icon: 'people', route: '/party' },
    { label: 'Load Management', icon: 'inventory_2', route: '/load' },
    { label: 'Vehicle Management', icon: 'local_shipping', route: '/vehicle' },
    { label: 'Trip Management', icon: 'map', route: '/trip' },
    { label: 'Expense Tracking', icon: 'receipt_long', route: '/expense' },
    { label: 'Payment Management', icon: 'payment', route: '/payment' },
    { label: 'Reports', icon: 'assessment', route: '/report' }
  ];

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
