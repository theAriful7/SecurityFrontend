import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';
import { DashboardComponent } from './components/vendor/dashboard/dashboard.component';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { CheckoutComponent } from './components/customer/checkout/checkout.component';
import { CustomerProductDetailComponent } from './components/customer/customer-product-detail/customer-product-detail.component';
import { CustomerProductListComponent } from './components/customer/customer-product-list/customer-product-list.component';
import { HomeComponent } from './components/home/home.component';
import { AddProductComponent } from './components/vendor/add-product/add-product.component';
import { OrdersComponent } from './components/vendor/orders/orders.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: CustomerProductListComponent },
  { path: 'products/:id', component: CustomerProductDetailComponent },

  // Customer routes - FIXED: Added customer route
  { 
    path: 'customer', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CUSTOMER] },
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Vendor routes - FIXED: Added vendor route
  { 
    path: 'vendor', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.VENDOR] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products/add', component: AddProductComponent },
      { path: 'products/edit/:id', component: AddProductComponent },
      { path: 'orders', component: OrdersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Admin routes - FIXED: Added admin route
  { 
    path: 'admin', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Delivery Agent routes - ADDED: For DELIVERY_AGENT role
  { 
    path: 'delivery', 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.DELIVERY_AGENT] },
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent }, // You can create a separate component later
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Common authenticated routes
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },

  // Fallback route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
