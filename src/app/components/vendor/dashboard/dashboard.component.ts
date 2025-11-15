import { Component, OnInit } from '@angular/core';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { Vendor } from 'src/app/models/vendor.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendor: Vendor | null = null;
  products: ProductResponseDTO[] = [];
  orders: OrderResponseDTO[] = [];
  loading = true;
  
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  };

  recentOrders: OrderResponseDTO[] = [];
  lowStockItems: ProductResponseDTO[] = [];

  constructor(
    private vendorService: VendorService,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVendorData();
  }

  loadVendorData(): void {
    this.loading = true;
    
    // Load vendor profile
    this.vendorService.getCurrentVendor().subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        this.loadProducts();
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        this.loading = false;
      }
    });
  }

  loadProducts(): void {
    if (!this.vendor?.id) return;

    this.productService.getVendorProducts(this.vendor.id).subscribe({
      next: (products) => {
        this.products = products;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        // Filter orders for this vendor
        this.orders = orders.filter(order => order.vendorId === this.vendor?.id);
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalProducts = this.products.length;
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter(order => 
      order.status === 'PENDING' || order.status === 'PROCESSING'
    ).length;
    this.stats.totalRevenue = this.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((total, order) => total + order.totalAmount, 0);
    this.stats.lowStockProducts = this.products.filter(product => product.stock < 10).length;

    // Recent orders (last 5)
    this.recentOrders = this.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Low stock items
    this.lowStockItems = this.products
      .filter(product => product.stock < 10)
      .slice(0, 5);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
