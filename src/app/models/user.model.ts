export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  enabled: boolean;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
  DELIVERY_AGENT = 'DELIVERY_AGENT'
}