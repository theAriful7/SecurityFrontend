import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { Vendor } from 'src/app/models/vendor.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css']
})
export class VendorProfileComponent implements OnInit {
  vendorForm: FormGroup;
  currentVendor: Vendor | null = null;
  vendorProducts: ProductResponseDTO[] = [];
  vendorOrders: OrderResponseDTO[] = [];
  loading = true;
  savingProfile = false;
  activeTab = 'dashboard';
  stats = {
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageRating: 4.5
  };

  // Chart data
  salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 1900, 1500, 2200, 1800, 2500],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  recentActivities = [
    { type: 'order', message: 'New order received #ORD-1234', time: '2 hours ago' },
    { type: 'product', message: 'Product "Wireless Headphones" approved', time: '5 hours ago' },
    { type: 'review', message: 'New review received for "Smart Watch"', time: '1 day ago' },
    { type: 'order', message: 'Order #ORD-1233 shipped', time: '1 day ago' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private vendorService: VendorService,
    private productService: ProductService,
    private orderService: OrderService
  ) {
    this.vendorForm = this.createVendorForm();
  }

  ngOnInit(): void {
    this.loadVendorData();
  }

  createVendorForm(): FormGroup {
    return this.fb.group({
      shopName: ['', [Validators.required, Validators.minLength(3)]],
      businessDescription: ['', [Validators.required, Validators.minLength(10)]],
      taxNumber: ['', Validators.required],
      address: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      website: [''],
      businessHours: this.fb.group({
        monday: ['9:00 AM - 6:00 PM'],
        tuesday: ['9:00 AM - 6:00 PM'],
        wednesday: ['9:00 AM - 6:00 PM'],
        thursday: ['9:00 AM - 6:00 PM'],
        friday: ['9:00 AM - 6:00 PM'],
        saturday: ['10:00 AM - 4:00 PM'],
        sunday: ['Closed']
      })
    });
  }

  loadVendorData(): void {
    this.loading = true;

    // Load current vendor profile
    this.vendorService.getCurrentVendor().subscribe({
      next: (vendor) => {
        this.currentVendor = vendor;
        this.vendorForm.patchValue({
          shopName: vendor.shopName,
          businessDescription: vendor.businessDescription,
          taxNumber: vendor.taxNumber,
          address: vendor.address,
          contactEmail: vendor.user?.email,
          contactPhone: vendor.user?.phone
        });
        this.loadVendorProducts();
        this.loadVendorOrders();
      },
      error: (error) => {
        console.error('Error loading vendor profile:', error);
        this.loading = false;
      }
    });
  }

  loadVendorProducts(): void {
    if (!this.currentVendor?.id) return;

    this.productService.getVendorProducts(this.currentVendor.id).subscribe({
      next: (products) => {
        this.vendorProducts = products;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading vendor products:', error);
      }
    });
  }

  loadVendorOrders(): void {
    // Since we don't have a direct vendor orders endpoint, we'll filter all orders
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        // Filter orders that contain vendor's products
        this.vendorOrders = orders.filter(order => 
          order.items?.some(item => 
            this.vendorProducts.some(product => product.id === item.productId)
          )
        );
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vendor orders:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalProducts = this.vendorProducts.length;
    this.stats.activeProducts = this.vendorProducts.filter(p => p.status === 'ACTIVE').length;
    this.stats.totalOrders = this.vendorOrders.length;
    this.stats.pendingOrders = this.vendorOrders.filter(o => 
      o.status === 'PENDING' || o.status === 'PROCESSING'
    ).length;
    this.stats.completedOrders = this.vendorOrders.filter(o => o.status === 'DELIVERED').length;
    this.stats.totalRevenue = this.vendorOrders
      .filter(o => o.status === 'DELIVERED')
      .reduce((total, order) => {
        const vendorItems = order.items?.filter(item => 
          this.vendorProducts.some(p => p.id === item.productId)
        ) || [];
        return total + vendorItems.reduce((sum, item) => sum + item.totalPrice, 0);
      }, 0);
  }

  updateVendorProfile(): void {
    if (this.vendorForm.invalid || !this.currentVendor) return;

    this.savingProfile = true;
    const vendorData = this.vendorForm.value;

    this.vendorService.updateMyVendorProfile(vendorData).subscribe({
      next: (updatedVendor) => {
        this.currentVendor = updatedVendor;
        this.savingProfile = false;
        // Show success message
        this.showSuccess('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating vendor profile:', error);
        this.savingProfile = false;
        this.showError('Failed to update profile. Please try again.');
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getProductStatusBadge(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getOrderStatusBadge(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'order': return 'fas fa-shopping-cart';
      case 'product': return 'fas fa-box';
      case 'review': return 'fas fa-star';
      default: return 'fas fa-bell';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100';
      case 'product': return 'text-green-600 bg-green-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  showSuccess(message: string): void {
    // Implement toast notification
    console.log('Success:', message);
  }

  showError(message: string): void {
    // Implement toast notification
    console.error('Error:', message);
  }

  getFormControl(controlName: string) {
    return this.vendorForm.get(controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.getFormControl(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Quick actions
  addNewProduct(): void {
    // Navigate to product creation page
    console.log('Navigate to product creation');
  }

  viewAllProducts(): void {
    this.setActiveTab('products');
  }

  viewAllOrders(): void {
    this.setActiveTab('orders');
  }
}
