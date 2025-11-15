import { Component, OnInit } from '@angular/core';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
   currentUser: User | null = null;
  orders: OrderResponseDTO[] = [];
  trendingProducts: ProductResponseDTO[] = [];
  bestSellingProducts: ProductResponseDTO[] = [];
  newArrivals: ProductResponseDTO[] = [];
  loading = true;
  productsLoading = true;
  
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadOrders();
    this.loadFeaturedProducts();
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.filter(order => order.userId === this.currentUser?.id);
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  loadFeaturedProducts(): void {
    this.productsLoading = true;
    
    // Load trending products
    this.productService.getTrendingProducts(8).subscribe({
      next: (products) => {
        this.trendingProducts = products;
      },
      error: (error) => {
        console.error('Error loading trending products:', error);
      }
    });

    // Load best selling products
    this.productService.getBestSellingProducts(8).subscribe({
      next: (products) => {
        this.bestSellingProducts = products;
      },
      error: (error) => {
        console.error('Error loading best selling products:', error);
      }
    });
  }

  calculateStats(): void {
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter(order => 
      order.status === 'PENDING' || order.status === 'PROCESSING'
    ).length;
    this.stats.deliveredOrders = this.orders.filter(order => 
      order.status === 'DELIVERED'
    ).length;
    this.stats.totalSpent = this.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) {
      return 'assets/images/placeholder.jpg';
    }
    const primary = images.find(img => img.isPrimary);
    return primary?.filePath || images[0]?.filePath || 'assets/images/placeholder.jpg';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  calculateDiscountPrice(price: number, discount?: number): number {
    return discount ? price - (price * discount / 100) : price;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }
}