import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isSidebarOpen = true;

  menuItems = [
    { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'User Management' },
    { path: '/admin/vendors', icon: 'fas fa-store', label: 'Vendor Management' },
    { path: '/admin/products', icon: 'fas fa-box', label: 'Product Management' },
    { path: '/admin/orders', icon: 'fas fa-shopping-cart', label: 'Order Management' },
    { path: '/admin/categories', icon: 'fas fa-tags', label: 'Categories' },
    { path: '/admin/reviews', icon: 'fas fa-star', label: 'Review Management' },
    { path: '/admin/analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
    { path: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
