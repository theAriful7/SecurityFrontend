import { User } from './user.model';
import { VendorStatus } from './vendorStatus.model';

export interface Vendor {
  id?: number;
  businessName: string;
  businessDescription?: string;
  taxNumber?: string;
  vendorStatus: VendorStatus;
  address?: string;
  approved: boolean;
  user?: User;
}