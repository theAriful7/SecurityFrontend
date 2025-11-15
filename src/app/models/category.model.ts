// Request DTO
export interface CategoryRequestDTO {
  name: string;
  description?: string;
}

// Response DTO
export interface CategoryResponseDTO {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}