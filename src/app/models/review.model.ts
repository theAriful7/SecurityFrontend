export interface ReviewRequestDTO {
  userId: number;
  productId: number;
  comment: string;
  rating: number;
}


export interface ReviewResponseDTO {
  id: number;
  userId: number;
  productId: number;
  comment: string;
  rating: number;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}