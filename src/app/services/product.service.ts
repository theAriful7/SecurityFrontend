import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ProductRequestDTO, ProductResponseDTO } from '../models/product.model';
import { ProductStatus } from '../models/productStatus.model';

export interface ProductFilter {
  categoryId?: number;
  subCategoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}


@Injectable({
  providedIn: 'root'
})


export class ProductService {

    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Vendor endpoints
  createProduct(vendorId: number, product: ProductRequestDTO): Observable<ProductResponseDTO> {
    return this.http.post<ProductResponseDTO>(`${this.apiUrl}/products/vendors/${vendorId}`, product);
  }

  getVendorProducts(vendorId: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/vendors/${vendorId}`);
  }

  getActiveVendorProducts(vendorId: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/vendors/${vendorId}/active`);
  }

  updateProduct(productId: number, vendorId: number, product: ProductRequestDTO): Observable<ProductResponseDTO> {
    return this.http.put<ProductResponseDTO>(`${this.apiUrl}/products/${productId}/vendors/${vendorId}`, product);
  }

  deleteProduct(productId: number, vendorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}/vendors/${vendorId}`);
  }

  // Public endpoints
  getProductById(productId: number): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.apiUrl}/products/${productId}`);
  }

  getAllProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products`);
  }

  getAllProductsPaginated(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/paginated?page=${page}&size=${size}`);
  }

  getProductsByCategory(categoryId: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/category/${categoryId}`);
  }

  getProductsByStatus(status: ProductStatus): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/status/${status}`);
  }

  // Search & Filter
  searchProducts(keyword: string): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/search?keyword=${keyword}`);
  }

  filterProducts(filter: ProductFilter): Observable<any> {
    let params = new HttpParams();
    
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.subCategoryId) params = params.set('subCategoryId', filter.subCategoryId.toString());
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.brand) params = params.set('brand', filter.brand);
    if (filter.minRating) params = params.set('minRating', filter.minRating.toString());
    if (filter.inStock !== undefined) params = params.set('inStock', filter.inStock.toString());
    
    params = params.set('page', (filter.page || 0).toString());
    params = params.set('size', (filter.size || 20).toString());
    params = params.set('sortBy', filter.sortBy || 'name');
    params = params.set('sortDirection', filter.sortDirection || 'asc');

    return this.http.get<any>(`${this.apiUrl}/products/filter`, { params });
  }

  // Featured products
  getTrendingProducts(limit: number = 10): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/trending?limit=${limit}`);
  }

  getBestSellingProducts(limit: number = 10): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/best-sellers?limit=${limit}`);
  }

  getFeaturedProducts(limit: number = 10): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/featured?limit=${limit}`);
  }

  // Admin endpoints
  changeProductStatus(productId: number, newStatus: ProductStatus): Observable<ProductResponseDTO> {
    return this.http.patch<ProductResponseDTO>(`${this.apiUrl}/products/${productId}/status?newStatus=${newStatus}`, {});
  }

  // Additional features
  getSimilarProducts(productId: number, limit: number = 8): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/${productId}/similar?limit=${limit}`);
  }

  getProductsBySubCategory(subCategoryId: number): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/products/sub-category/${subCategoryId}`);
  }
}
