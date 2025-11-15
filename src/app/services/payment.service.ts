import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PaymentRequestDTO } from '../models/payment.model';
import { PaymentMethod } from '../models/PaymentMethod';
import { PaymentOption } from '../models/paymentOption.model';
import { PaymentStatus } from '../models/paymentStatus.model';
import { PaymentResponseDTO } from '../models/paymentResponseDTO.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createPayment(payment: PaymentRequestDTO): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>(`${this.apiUrl}/payments`, payment);
  }

  getPaymentById(id: number): Observable<PaymentResponseDTO> {
    return this.http.get<PaymentResponseDTO>(`${this.apiUrl}/payments/${id}`);
  }

  getPaymentByOrderId(orderId: number): Observable<PaymentResponseDTO> {
    return this.http.get<PaymentResponseDTO>(`${this.apiUrl}/payments/order/${orderId}`);
  }

  getAllPayments(): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/payments`);
  }

  getPaymentsByStatus(status: PaymentStatus): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/payments/status/${status}`);
  }

  getPaymentsByMethod(method: PaymentMethod): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/payments/method/${method}`);
  }

  getPaymentsByOption(option: PaymentOption): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.apiUrl}/payments/option/${option}`);
  }

  updatePaymentStatus(id: number, status: PaymentStatus): Observable<PaymentResponseDTO> {
    return this.http.put<PaymentResponseDTO>(`${this.apiUrl}/payments/${id}/status?status=${status}`, {});
  }

  processPayment(id: number, transactionId?: string): Observable<PaymentResponseDTO> {
    const url = transactionId 
      ? `${this.apiUrl}/payments/${id}/process?transactionId=${transactionId}`
      : `${this.apiUrl}/payments/${id}/process`;
    return this.http.post<PaymentResponseDTO>(url, {});
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payments/${id}`);
  }
}