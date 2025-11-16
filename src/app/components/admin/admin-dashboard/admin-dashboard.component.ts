import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
stats = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalVendors: 0,
    pendingVendors: 0,
    revenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    activeProducts: 0
  };

  recentOrders: any[] = [];
  recentVendors: any[] = [];
  topProducts: any[] = [];
  orderStatusCounts: any = {};
  revenueChart: any;
  orderStatusChart: any;

  isLoading = true;

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
    this.isLoading = true;

    // Load users count
    this.userService.getUsersByRole('CUSTOMER').subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
      },
      error: (error) => console.error('Error loading users:', error)
    });

    // Load products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.stats.totalProducts = products.length;
        this.stats.activeProducts = products.filter(p => p.status === 'ACTIVE').length;
        this.topProducts = products
          .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading products:', error)
    });

    // Load orders
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.recentOrders = orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        this.calculateOrderStats(orders);
        this.createCharts(orders);
      },
      error: (error) => console.error('Error loading orders:', error)
    });

    // Load vendors
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.stats.totalVendors = vendors.length;
        this.recentVendors = vendors
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading vendors:', error)
    });

    this.vendorService.getPendingVendors().subscribe({
      next: (pending) => {
        this.stats.pendingVendors = pending.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending vendors:', error);
        this.isLoading = false;
      }
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
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Count orders by status
    this.orderStatusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }

  createCharts(orders: any[]): void {
    // Revenue Chart (Last 7 days)
    const last7Days = this.getLast7Days();
    const revenueData = this.calculateRevenueByDay(orders, last7Days);

    this.revenueChart = new Chart('revenueChart', {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [{
          label: 'Revenue (Last 7 Days)',
          data: revenueData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });

    // Order Status Chart
    const statusLabels = Object.keys(this.orderStatusCounts);
    const statusData = Object.values(this.orderStatusCounts);

    this.orderStatusChart = new Chart('orderStatusChart', {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: [
            '#F59E0B', // Pending - yellow
            '#3B82F6', // Processing - blue
            '#10B981', // Delivered - green
            '#EF4444', // Cancelled - red
            '#8B5CF6', // Other - purple
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }

  getLast7Days(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  }

  calculateRevenueByDay(orders: any[], days: string[]): number[] {
    const revenueByDay = days.map(day => {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric' 
        });
        return orderDate === day && order.status === 'DELIVERED';
      });
      return dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    });
    return revenueByDay;
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

  ngOnDestroy(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.orderStatusChart) {
      this.orderStatusChart.destroy();
    }
  }
}
