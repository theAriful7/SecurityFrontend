import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemResponseDTO } from 'src/app/models/cart-item.model';
import { CartResponseDTO } from 'src/app/models/cart.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartItemService } from 'src/app/services/cart-item.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: CartResponseDTO | null = null;
  cartItems: CartItemResponseDTO[] = [];
  loading = true;
  updatingItems = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private cartItemService: CartItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadCart();
      } else {
        this.loading = false;
      }
    });
  }

  loadCart(): void {
    this.loading = true;
    if (!this.currentUser?.id) return;

    this.cartService.getCartByUser(this.currentUser.id).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cartItems = cart.items || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
      }
    });
  }

  updateQuantity(item: CartItemResponseDTO, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    this.updatingItems = true;
    this.cartItemService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        const index = this.cartItems.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
          this.cartItems[index] = updatedItem;
        }
        this.updateCartTotal();
        this.updatingItems = false;
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.updatingItems = false;
      }
    });
  }

  removeItem(item: CartItemResponseDTO): void {
    this.updatingItems = true;
    this.cartItemService.deleteCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
        this.updateCartTotal();
        this.updatingItems = false;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.updatingItems = false;
      }
    });
  }

  clearCart(): void {
    if (!this.cart) return;

    this.updatingItems = true;
    this.cartService.clearCart(this.cart.id).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.cartItems = [];
        this.updatingItems = false;
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.updatingItems = false;
      }
    });
  }

  updateCartTotal(): void {
    if (this.cart) {
      this.cart.totalPrice = this.cartItems.reduce(
        (total, item) => total + (item.totalPrice || 0), 0
      );
      this.cart.totalItems = this.cartItems.reduce(
        (total, item) => total + (item.quantity || 0), 0
      );
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5.99;
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
