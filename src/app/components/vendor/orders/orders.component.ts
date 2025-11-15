import { Component, OnInit } from '@angular/core';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { Vendor } from 'src/app/models/vendor.model';
import { OrderService } from 'src/app/services/order.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: OrderResponseDTO[] = [];
  vendor: Vendor | null = null;
  loading = true;
  statusFilter = 'ALL';

  constructor(
    private orderService: OrderService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.loadVendorOrders();
  }

  loadVendorOrders(): void {
    this.loading = true;
    
    this.vendorService.getCurrentVendor().subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        this.orderService.getAllOrders().subscribe({
          next: (orders) => {
            // Filter orders for this vendor
            this.orders = orders.filter(order => order.vendorId === vendor.id);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading orders:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        this.loading = false;
      }
    });
  }

  get filteredOrders(): OrderResponseDTO[] {
    if (this.statusFilter === 'ALL') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.statusFilter);
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus as any).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusOptions(currentStatus: string): string[] {
    const statusFlow = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': []
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || [];
  }
}
