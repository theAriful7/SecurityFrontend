import { Component, OnInit } from '@angular/core';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { OrderStatus } from 'src/app/models/orderStatus';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin-orders-list',
  templateUrl: './admin-orders-list.component.html',
  styleUrls: ['./admin-orders-list.component.css']
})
export class AdminOrdersListComponent implements OnInit {
  orders: OrderResponseDTO[] = [];
  filteredOrders: OrderResponseDTO[] = [];
  selectedOrder: OrderResponseDTO | null = null;
  
  searchTerm: string = '';
  selectedStatus: string = 'ALL';
  dateRange: { start: string, end: string } = { start: '', end: '' };
  
  isLoading = false;
  showOrderModal = false;

  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'READY_FOR_SHIPMENT', label: 'Ready for Shipment' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.orderNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.id.toString().includes(this.searchTerm);
      
      const matchesStatus = this.selectedStatus === 'ALL' || 
        order.status === this.selectedStatus;
      
      const matchesDate = !this.dateRange.start || !this.dateRange.end ||
        (new Date(order.createdAt) >= new Date(this.dateRange.start) &&
         new Date(order.createdAt) <= new Date(this.dateRange.end));
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  viewOrderDetails(order: OrderResponseDTO): void {
    this.selectedOrder = order;
    this.showOrderModal = true;
  }

  updateOrderStatus(order: OrderResponseDTO, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  getStatusBadgeClass(status: OrderStatus): string {
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
