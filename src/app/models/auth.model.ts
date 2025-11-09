import { UserRole } from './user.model';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: UserRole;
  firstName: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
}

export interface VendorRegisterRequest {
  businessName: string;
  businessDescription?: string;
  taxNumber?: string;
  address?: string;
  userEmail: string;
}