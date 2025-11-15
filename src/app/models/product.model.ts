import { FileDataDTO } from './file-data.model';
import { ProductSpecificationDTO } from './product-specification.model';

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

// You might want a response DTO too (I'll create a basic one)
export interface ProductResponseDTO {
  id: number;
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
  createdAt?: Date;
  updatedAt?: Date;
}