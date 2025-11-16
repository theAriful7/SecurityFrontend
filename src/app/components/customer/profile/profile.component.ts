import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressResponseDTO, AddressRequestDTO } from 'src/app/models/address.model';
import { OrderResponseDTO } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { AddressService } from 'src/app/services/address.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [DatePipe]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  addressForm: FormGroup;
  currentUser: User | null = null;
  addresses: AddressResponseDTO[] = [];
  orders: OrderResponseDTO[] = [];
  activeTab = 'profile';
  loading = true;
  savingProfile = false;
  savingAddress = false;
  showAddressForm = false;
  editingAddress: AddressResponseDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private addressService: AddressService,
    private orderService: OrderService
  ) {
    this.profileForm = this.createProfileForm();
    this.addressForm = this.createAddressForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      recipientName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfileData();
        this.loadAddresses();
        this.loadOrders();
      } else {
        this.loading = false;
      }
    });
  }

  loadProfileData(): void {
    if (!this.currentUser) return;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          phone: user.phone || ''
        });
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }

  loadAddresses(): void {
    if (!this.currentUser?.id) return;

    this.addressService.getAddressesByUser(this.currentUser.id).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
      }
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.filter(order => order.userId === this.currentUser?.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) return;

    this.savingProfile = true;
    const profileData = this.profileForm.value;

    this.userService.updateUser(this.currentUser.id, profileData).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.savingProfile = false;
        // Show success message
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.savingProfile = false;
      }
    });
  }

  saveAddress(): void {
    if (this.addressForm.invalid || !this.currentUser?.id) return;

    this.savingAddress = true;
    const addressData: AddressRequestDTO = {
      user_id: this.currentUser.id,
      ...this.addressForm.value
    };

    if (this.editingAddress) {
      // Update existing address
      this.addressService.updateAddress(this.editingAddress.id, addressData).subscribe({
        next: (updatedAddress) => {
          const index = this.addresses.findIndex(addr => addr.id === updatedAddress.id);
          if (index !== -1) {
            this.addresses[index] = updatedAddress;
          }
          this.resetAddressForm();
          this.savingAddress = false;
        },
        error: (error) => {
          console.error('Error updating address:', error);
          this.savingAddress = false;
        }
      });
    } else {
      // Create new address
      this.addressService.createAddress(addressData).subscribe({
        next: (newAddress) => {
          this.addresses.push(newAddress);
          this.resetAddressForm();
          this.savingAddress = false;
        },
        error: (error) => {
          console.error('Error creating address:', error);
          this.savingAddress = false;
        }
      });
    }
  }

  editAddress(address: AddressResponseDTO): void {
    this.editingAddress = address;
    this.showAddressForm = true;
    this.addressForm.patchValue({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone
    });
  }

  deleteAddress(addressId: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(addressId).subscribe({
        next: () => {
          this.addresses = this.addresses.filter(addr => addr.id !== addressId);
        },
        error: (error) => {
          console.error('Error deleting address:', error);
        }
      });
    }
  }

  resetAddressForm(): void {
    this.addressForm.reset();
    this.showAddressForm = false;
    this.editingAddress = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getFormControl(form: FormGroup, controlName: string) {
    return form.get(controlName);
  }

  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = this.getFormControl(form, controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
