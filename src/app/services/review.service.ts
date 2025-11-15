import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ReviewRequestDTO, ReviewResponseDTO } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

 
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createReview(review: ReviewRequestDTO): Observable<ReviewResponseDTO> {
    return this.http.post<ReviewResponseDTO>(`${this.apiUrl}/reviews`, review);
  }

  getAllReviews(): Observable<ReviewResponseDTO[]> {
    return this.http.get<ReviewResponseDTO[]>(`${this.apiUrl}/reviews`);
  }

  getReviewsByProduct(productId: number): Observable<ReviewResponseDTO[]> {
    return this.http.get<ReviewResponseDTO[]>(`${this.apiUrl}/reviews/product/${productId}`);
  }

  getReviewsByUser(userId: number): Observable<ReviewResponseDTO[]> {
    return this.http.get<ReviewResponseDTO[]>(`${this.apiUrl}/reviews/user/${userId}`);
  }

  deleteReview(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/reviews/${id}`);
  }
}
