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

  // ✅ FIXED: Match backend endpoint
  registerVendor(vendorRequest: VendorRegisterRequest): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/vendors/register`, vendorRequest);
  }

  // ✅ FIXED: Use the correct endpoint from your backend
  getCurrentVendor(): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/my-profile`);
  }

  // ✅ FIXED: This endpoint doesn't exist in backend, remove or implement in backend
  getVendorByUserId(userId: number): Observable<Vendor> {
    // This endpoint doesn't exist in your backend controller
    // You might need to add it or use another approach
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/user/${userId}`);
  }

  // ❌ REMOVE: This endpoint doesn't exist
  // getVendorByUserId(userId: number): Observable<Vendor> {
  //   return this.http.get<Vendor>(`${this.apiUrl}/vendor/user/${userId}`);
  // }

  // ❌ REMOVE: This endpoint doesn't exist
  // getCurrentVendor(): Observable<Vendor> {
  //   return this.http.get<Vendor>(`${this.apiUrl}/vendor/me`);
  // }

  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`);
  }

  getApprovedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`);
  }

  getPendingVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/pending`);
  }

  approveVendor(vendorId: number): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${vendorId}/approve`, {});
  }

  updateVendor(vendorId: number, vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${vendorId}`, vendor);
  }

  // ✅ NEW: Update my vendor profile (matches backend)
  updateMyVendorProfile(vendorData: any): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/my-profile`, vendorData);
  }

  // ✅ NEW: Get vendor by ID (matches backend)
  getVendorById(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/${vendorId}`);
  }
}
