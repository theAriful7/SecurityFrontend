// Request DTO
export interface SubCategoryRequestDTO {
  name: string;
  description?: string;
  categoryId: number;
}

// Response DTO (you might want one)
export interface SubCategoryResponseDTO {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}