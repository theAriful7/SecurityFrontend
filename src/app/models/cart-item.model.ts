// Request DTO
export interface CartItemRequestDTO {
  cartId: number;
  productId: number;
  quantity?: number;
}

// Response DTO
export interface CartItemResponseDTO {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;    
  pricePerItem: number;
  quantity: number;
  totalPrice: number;
  cartId: number;
}