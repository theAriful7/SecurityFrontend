import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CategoryRequestDTO, CategoryResponseDTO } from '../models/category.model';
import { SubCategoryResponseDTO } from '../models/sub-category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getSubCategoriesByCategory(categoryId: number): Observable<SubCategoryResponseDTO[]> {
  return this.http.get<SubCategoryResponseDTO[]>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
}

  createCategory(category: CategoryRequestDTO): Observable<CategoryResponseDTO> {
    return this.http.post<CategoryResponseDTO>(`${this.apiUrl}/categories`, category);
  }

  getAllCategories(): Observable<CategoryResponseDTO[]> {
    return this.http.get<CategoryResponseDTO[]>(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: number): Observable<CategoryResponseDTO> {
    return this.http.get<CategoryResponseDTO>(`${this.apiUrl}/categories/${id}`);
  }

  updateCategory(id: number, category: CategoryRequestDTO): Observable<CategoryResponseDTO> {
    return this.http.put<CategoryResponseDTO>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }
}
