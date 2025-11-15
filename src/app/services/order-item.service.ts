import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderItemRequestDTO, OrderItemResponseDTO, OrderItemUpdateRequestDTO } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addOrderItem(orderId: number, orderItem: OrderItemRequestDTO): Observable<OrderItemResponseDTO> {
    return this.http.post<OrderItemResponseDTO>(`${this.apiUrl}/order_items/${orderId}`, orderItem);
  }

  updateOrderItem(orderId: number, orderItem: OrderItemUpdateRequestDTO): Observable<OrderItemResponseDTO> {
    return this.http.put<OrderItemResponseDTO>(`${this.apiUrl}/order_items/${orderId}`, orderItem);
  }

  getOrderItems(orderId: number): Observable<OrderItemResponseDTO[]> {
    return this.http.get<OrderItemResponseDTO[]>(`${this.apiUrl}/order_items/${orderId}`);
  }

  deleteOrderItem(orderId: number, productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/order_items/${orderId}/${productId}`);
  }
}
