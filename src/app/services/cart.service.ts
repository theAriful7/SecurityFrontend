import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CartResponseDTO, CartRequestDTO } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCartByUser(userId: number): Observable<CartResponseDTO> {
    return this.http.get<CartResponseDTO>(`${this.apiUrl}/carts/user/${userId}`);
  }

  clearCart(cartId: number): Observable<CartResponseDTO> {
    return this.http.post<CartResponseDTO>(`${this.apiUrl}/carts/${cartId}/clear`, {});
  }

  createCart(cart: CartRequestDTO): Observable<CartResponseDTO> {
    return this.http.post<CartResponseDTO>(`${this.apiUrl}/carts`, cart);
  }

  getCartById(id: number): Observable<CartResponseDTO> {
    return this.http.get<CartResponseDTO>(`${this.apiUrl}/carts/${id}`);
  }

  getAllCarts(): Observable<CartResponseDTO[]> {
    return this.http.get<CartResponseDTO[]>(`${this.apiUrl}/carts`);
  }

  deleteCart(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/carts/${id}`);
  }
}
