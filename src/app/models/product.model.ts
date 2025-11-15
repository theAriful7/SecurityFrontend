import { FileDataDTO } from './file-data.model';
import { ProductSpecificationDTO } from './product-specification.model';
import { ProductStatus } from './productStatus.model';

// Request DTO
export interface ProductRequestDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: FileDataDTO[];
  categoryId: number;
  subCategoryId?: number;
  discount?: number;
  brand?: string;
  specifications?: ProductSpecificationDTO[];
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: FileDataDTO[];
  discount?: number;
  brand?: string;
  categoryName: string;        // Added
  subCategoryName?: string;    // Added
  status: ProductStatus;       // Added
  vendorId: number;            // Added
  vendorName: string;          // Added - This is what you want!
  createdAt?: Date;
  updatedAt?: Date;
  specifications?: ProductSpecificationDTO[];
  // Optional: You might also want these from backend
  viewCount?: number;
  salesCount?: number;
  rating?: number;
}