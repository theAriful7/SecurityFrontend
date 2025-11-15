import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AddressResponseDTO, AddressRequestDTO } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAddresses(): Observable<AddressResponseDTO[]> {
    return this.http.get<AddressResponseDTO[]>(`${this.apiUrl}/address`);
  }

  getAddressById(id: number): Observable<AddressResponseDTO> {
    return this.http.get<AddressResponseDTO>(`${this.apiUrl}/address/${id}`);
  }

  getAddressesByUser(userId: number): Observable<AddressResponseDTO[]> {
    return this.http.get<AddressResponseDTO[]>(`${this.apiUrl}/address/user/${userId}`);
  }

  createAddress(address: AddressRequestDTO): Observable<AddressResponseDTO> {
    return this.http.post<AddressResponseDTO>(`${this.apiUrl}/address`, address);
  }

  updateAddress(id: number, address: AddressRequestDTO): Observable<AddressResponseDTO> {
    return this.http.put<AddressResponseDTO>(`${this.apiUrl}/address/${id}`, address);
  }

  deleteAddress(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/address/${id}`);
  }

  deleteAddressWithUser(addressId: number, userId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/address/${addressId}/user/${userId}`);
  }

  getAddressCountByUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/address/count/${userId}`);
  }

  userHasAddresses(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/address/has/${userId}`);
  }

  getDefaultAddress(userId: number): Observable<AddressResponseDTO> {
    return this.http.get<AddressResponseDTO>(`${this.apiUrl}/address/default/${userId}`);
  }
}
