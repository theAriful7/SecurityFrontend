import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CartItemRequestDTO, CartItemResponseDTO } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartItemService {

    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createCartItem(cartItem: CartItemRequestDTO): Observable<CartItemResponseDTO> {
    return this.http.post<CartItemResponseDTO>(`${this.apiUrl}/cart_items`, cartItem);
  }

  getCartItemById(id: number): Observable<CartItemResponseDTO> {
    return this.http.get<CartItemResponseDTO>(`${this.apiUrl}/cart_items/${id}`);
  }

  getCartItemsByCartId(cartId: number): Observable<CartItemResponseDTO[]> {
    return this.http.get<CartItemResponseDTO[]>(`${this.apiUrl}/cart_items/cart/${cartId}`);
  }

  getAllCartItems(): Observable<CartItemResponseDTO[]> {
    return this.http.get<CartItemResponseDTO[]>(`${this.apiUrl}/cart_items`);
  }

  getCartItemByCartAndProduct(cartId: number, productId: number): Observable<CartItemResponseDTO> {
    return this.http.get<CartItemResponseDTO>(`${this.apiUrl}/cart_items/cart/${cartId}/product/${productId}`);
  }

  isProductInCart(cartId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/cart_items/cart/${cartId}/product/${productId}/exists`);
  }

  getCartItemsCount(cartId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cart_items/cart/${cartId}/count`);
  }

  getCartSubtotal(cartId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cart_items/cart/${cartId}/subtotal`);
  }

  updateCartItemQuantity(id: number, quantity: number): Observable<CartItemResponseDTO> {
    return this.http.patch<CartItemResponseDTO>(`${this.apiUrl}/cart_items/${id}/quantity?quantity=${quantity}`, {});
  }

  updateCartItem(id: number, cartItem: CartItemRequestDTO): Observable<CartItemResponseDTO> {
    return this.http.put<CartItemResponseDTO>(`${this.apiUrl}/cart_items/${id}`, cartItem);
  }

  deleteCartItem(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cart_items/${id}`);
  }

  deleteCartItemByCartAndProduct(cartId: number, productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cart_items/cart/${cartId}/product/${productId}`);
  }

  clearCartItems(cartId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cart_items/cart/${cartId}/clear`);
  }
}
