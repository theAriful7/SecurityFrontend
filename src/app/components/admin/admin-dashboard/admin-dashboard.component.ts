import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalVendors: 0,
    pendingVendors: 0,
    revenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  };

  recentOrders: any[] = [];
  recentVendors: any[] = [];
  orderStatusCounts: any = {};

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load users
    this.userService.getUsersByRole('CUSTOMER').subscribe(users => {
      this.stats.totalUsers = users.length;
    });

    // Load products
    this.productService.getTotalProductCount().subscribe(count => {
      this.stats.totalProducts = count;
    });

    // Load orders
    this.orderService.getAllOrders().subscribe(orders => {
      this.stats.totalOrders = orders.length;
      this.recentOrders = orders.slice(0, 5);
      this.calculateOrderStats(orders);
    });

    // Load vendors
    this.vendorService.getAllVendors().subscribe(vendors => {
      this.stats.totalVendors = vendors.length;
      this.recentVendors = vendors.slice(0, 5);
    });

    this.vendorService.getPendingVendors().subscribe(pending => {
      this.stats.pendingVendors = pending.length;
    });
  }

  calculateOrderStats(orders: any[]): void {
    this.stats.pendingOrders = orders.filter(o => 
      o.status === 'PENDING' || o.status === 'PROCESSING'
    ).length;
    
    this.stats.deliveredOrders = orders.filter(o => 
      o.status === 'DELIVERED'
    ).length;

    this.stats.revenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Count orders by status
    this.orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'READY_FOR_SHIPMENT': return 'bg-purple-100 text-purple-800';
      case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-800';
      case 'OUT_FOR_DELIVERY': return 'bg-pink-100 text-pink-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
