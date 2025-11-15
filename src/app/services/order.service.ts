import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderRequestDTO, OrderResponseDTO } from '../models/order.model';
import { OrderStatus } from '../models/orderStatus';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: OrderRequestDTO): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>(`${this.apiUrl}/orders`, order);
  }

  getAllOrders(): Observable<OrderResponseDTO[]> {
    return this.http.get<OrderResponseDTO[]>(`${this.apiUrl}/orders`);
  }

  getOrderById(id: number): Observable<OrderResponseDTO> {
    return this.http.get<OrderResponseDTO>(`${this.apiUrl}/orders/${id}`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<OrderResponseDTO> {
    return this.http.put<OrderResponseDTO>(`${this.apiUrl}/orders/${id}/status?status=${status}`, {});
  }

  deleteOrder(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/orders/${id}`);
  }

  checkout(userId: number, addressId: number): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>(`${this.apiUrl}/orders/checkout?userId=${userId}&addressId=${addressId}`, {});
  }
}
