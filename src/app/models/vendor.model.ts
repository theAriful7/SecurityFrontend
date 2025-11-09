import { User } from './user.model';

export interface Vendor {
  id?: number;
  businessName: string;
  businessDescription?: string;
  taxNumber?: string;
  address?: string;
  approved: boolean;
  user?: User;
}