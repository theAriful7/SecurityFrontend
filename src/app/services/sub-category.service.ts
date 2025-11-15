import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SubCategoryRequestDTO, SubCategoryResponseDTO } from '../models/sub-category.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createSubCategory(subCategory: SubCategoryRequestDTO): Observable<SubCategoryResponseDTO> {
    return this.http.post<SubCategoryResponseDTO>(`${this.apiUrl}/sub-categories`, subCategory);
  }

  getAllSubCategories(): Observable<SubCategoryResponseDTO[]> {
    return this.http.get<SubCategoryResponseDTO[]>(`${this.apiUrl}/sub-categories`);
  }

  getSubCategoryById(id: number): Observable<SubCategoryResponseDTO> {
    return this.http.get<SubCategoryResponseDTO>(`${this.apiUrl}/sub-categories/${id}`);
  }

  getSubCategoriesByCategory(categoryId: number): Observable<SubCategoryResponseDTO[]> {
    return this.http.get<SubCategoryResponseDTO[]>(`${this.apiUrl}/sub-categories/category/${categoryId}`);
  }

  updateSubCategory(id: number, subCategory: SubCategoryRequestDTO): Observable<SubCategoryResponseDTO> {
    return this.http.put<SubCategoryResponseDTO>(`${this.apiUrl}/sub-categories/${id}`, subCategory);
  }

  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sub-categories/${id}`);
  }

  searchSubCategories(keyword: string): Observable<SubCategoryResponseDTO[]> {
    return this.http.get<SubCategoryResponseDTO[]>(`${this.apiUrl}/sub-categories/search?keyword=${keyword}`);
  }
}
