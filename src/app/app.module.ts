import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { DashboardComponent } from './components/vendor/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { SharedComponent } from './components/shared/shared.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { CustomerProductListComponent } from './components/customer/customer-product-list/customer-product-list.component';
import { CustomerProductDetailComponent } from './components/customer/customer-product-detail/customer-product-detail.component';
import { CartComponent } from './components/customer/cart/cart.component';
import { CheckoutComponent } from './components/customer/checkout/checkout.component';
import { VendorProductComponent } from './components/vendor/vendor-product/vendor-product.component';
import { OrdersComponent } from './components/vendor/orders/orders.component';
import { AddProductComponent } from './components/vendor/add-product/add-product.component';
import { UsersComponent } from './components/admin/users/users.component';
import { VendorsComponent } from './components/admin/vendors/vendors.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';
import { AdminOrdersListComponent } from './components/admin/admin-orders-list/admin-orders-list.component';
import { UserManagementComponentComponent } from './components/admin/user-management-component/user-management-component.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DashboardComponent,
    AdminDashboardComponent,
    CustomerDashboardComponent,
    SharedComponent,
    HeaderComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    CustomerProductListComponent,
    CustomerProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    VendorProductComponent,
    OrdersComponent,
    AddProductComponent,
    UsersComponent,
    VendorsComponent,
    CategoriesComponent,
    AdminOrdersListComponent,
    UserManagementComponentComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
