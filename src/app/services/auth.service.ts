import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, authRequest)
      .pipe(
        tap(response => {
          console.log('🔐 Raw login response:', response);
          this.storeAuthData(response);
          this.loadCurrentUser();
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): UserRole | null {
    const user = this.currentUserSubject.value;
    console.log('👤 Current user from subject:', user);
    return user ? user.role : null;
  }

  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    
    // SAFE: Convert role string to UserRole enum
    const userRole = this.safeConvertToUserRole(response.role);
    
    // Create a proper User object from the response
    const user: User = {
      email: response.email,
      firstName: response.firstName,
      role: userRole,
      enabled: true
    };
    
    console.log('💾 Storing user in localStorage:', user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private safeConvertToUserRole(role: any): UserRole {
    console.log('🔄 Converting role to UserRole:', role, typeof role);
    
    if (typeof role === 'string') {
      // Convert string to UserRole enum
      const roleUpper = role.toUpperCase();
      switch (roleUpper) {
        case 'ADMIN':
          return UserRole.ADMIN;
        case 'VENDOR':
          return UserRole.VENDOR;
        case 'DELIVERY_AGENT':
          return UserRole.DELIVERY_AGENT;
        case 'CUSTOMER':
        default:
          return UserRole.CUSTOMER;
      }
    }
    
    // If it's already a UserRole, return it directly
    if (Object.values(UserRole).includes(role)) {
      return role as UserRole;
    }
    
    console.warn('⚠️ Unknown role received, defaulting to CUSTOMER:', role);
    return UserRole.CUSTOMER;
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    console.log('📥 Loading user from storage:', userStr);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        
        // Convert stored role back to UserRole enum
        if (userData.role) {
          userData.role = this.safeConvertToUserRole(userData.role);
        }
        
        this.currentUserSubject.next(userData);
        console.log('✅ User loaded from storage:', userData);
      } catch (error) {
        console.error('❌ Error parsing user data from localStorage:', error);
        this.logout();
      }
    }
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        
        // Convert stored role back to UserRole enum
        if (userData.role) {
          userData.role = this.safeConvertToUserRole(userData.role);
        }
        
        this.currentUserSubject.next(userData);
        console.log('✅ Current user loaded:', userData);
      } catch (error) {
        console.error('❌ Error parsing current user data:', error);
        this.logout();
      }
    }
  }
}
