import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { VendorRegisterRequest } from '../models/auth.model';
import { Vendor } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerVendor(vendorRequest: VendorRegisterRequest): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/vendor/register`, vendorRequest);
  }

  getVendorByUserId(userId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendor/user/${userId}`);
  }

  getCurrentVendor(): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendor/me`);
  }

  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/admin/vendors`);
  }

  getApprovedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/approved`);
  }

  getPendingVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/admin/vendors/pending`);
  }

  approveVendor(vendorId: number): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/admin/vendors/${vendorId}/approve`, {});
  }

  updateVendor(vendorId: number, vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendor/${vendorId}`, vendor);
  }
}
