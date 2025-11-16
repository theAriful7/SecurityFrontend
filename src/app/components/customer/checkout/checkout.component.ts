import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressResponseDTO, AddressRequestDTO } from 'src/app/models/address.model';
import { CartItemResponseDTO } from 'src/app/models/cart-item.model';
import { CartResponseDTO } from 'src/app/models/cart.model';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { PaymentMethod } from 'src/app/models/PaymentMethod';
import { PaymentOption } from 'src/app/models/paymentOption.model';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: CartResponseDTO | null = null;
  cartItems: CartItemResponseDTO[] = [];
  addresses: AddressResponseDTO[] = [];
  loading = true;
  placingOrder = false;
  currentUser: any = null;

  paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Credit Card', icon: 'fas fa-credit-card' },
    { value: 'DEBIT_CARD', label: 'Debit Card', icon: 'fas fa-credit-card' },
    { value: 'PAYPAL', label: 'PayPal', icon: 'fab fa-paypal' },
    { value: 'COD', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' }
  ];

  paymentOptions = [
    { value: 'VISA', label: 'Visa', icon: 'fab fa-cc-visa' },
    { value: 'MASTERCARD', label: 'MasterCard', icon: 'fab fa-cc-mastercard' },
    { value: 'AMEX', label: 'American Express', icon: 'fab fa-cc-amex' }
  ];

  selectedPaymentMethod: PaymentMethod = 'CREDIT_CARD' as PaymentMethod;
  selectedPaymentOption: PaymentOption = 'VISA';
  useExistingAddress = true;
  showAddressForm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.checkoutForm = this.createCheckoutForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  createCheckoutForm(): FormGroup {
    return this.fb.group({
      // Shipping Address
      recipientName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      
      // Payment Details
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', Validators.required],
      
      // Order Notes
      notes: ['']
    });
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadCart();
        this.loadAddresses();
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  loadCart(): void {
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

  loadAddresses(): void {
    if (!this.currentUser?.id) return;

    this.addressService.getAddressesByUser(this.currentUser.id).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        if (addresses.length > 0) {
          this.selectAddress(addresses[0]);
        } else {
          this.useExistingAddress = false;
          this.showAddressForm = true;
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
      }
    });
  }

  selectAddress(address: AddressResponseDTO): void {
    this.checkoutForm.patchValue({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone
    });
  }

  toggleAddressForm(): void {
    this.useExistingAddress = !this.useExistingAddress;
    this.showAddressForm = !this.useExistingAddress;
    
    if (this.useExistingAddress && this.addresses.length > 0) {
      this.selectAddress(this.addresses[0]);
    } else {
      this.checkoutForm.patchValue({
        recipientName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
      });
    }
  }

  addNewAddress(): void {
    if (!this.currentUser?.id) return;

    const addressData: AddressRequestDTO = {
      user_id: this.currentUser.id,
      recipientName: this.checkoutForm.get('recipientName')?.value,
      street: this.checkoutForm.get('street')?.value,
      city: this.checkoutForm.get('city')?.value,
      state: this.checkoutForm.get('state')?.value,
      postalCode: this.checkoutForm.get('postalCode')?.value,
      country: this.checkoutForm.get('country')?.value,
      phone: this.checkoutForm.get('phone')?.value
    };

    this.addressService.createAddress(addressData).subscribe({
      next: (newAddress) => {
        this.addresses.push(newAddress);
        this.useExistingAddress = true;
        this.showAddressForm = false;
        this.selectAddress(newAddress);
      },
      error: (error) => {
        console.error('Error creating address:', error);
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5.99;
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTax();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid || !this.currentUser?.id || !this.cart) {
      return;
    }

    this.placingOrder = true;

    // Create order using checkout
    this.orderService.checkout(this.currentUser.id, this.addresses[0]?.id || 0).subscribe({
      next: (order: OrderResponseDTO) => {
        // Create payment
        const paymentData = {
          orderId: order.id,
          paymentMethod: this.selectedPaymentMethod,
          paymentOption: this.selectedPaymentOption,
          transactionId: this.generateTransactionId()
        };

        this.paymentService.createPayment(paymentData).subscribe({
          next: (payment) => {
            this.placingOrder = false;
            this.router.navigate(['/order-confirmation'], { 
              queryParams: { orderId: order.id } 
            });
          },
          error: (error) => {
            console.error('Error creating payment:', error);
            this.placingOrder = false;
          }
        });
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.placingOrder = false;
      }
    });
  }

  generateTransactionId(): string {
    return 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  getFormControl(controlName: string) {
    return this.checkoutForm.get(controlName);
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.getFormControl(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}