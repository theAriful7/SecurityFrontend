// Request DTO
export interface OrderItemRequestDTO {
  productId: number;
  quantity: number;
}

// Update Request DTO
export interface OrderItemUpdateRequestDTO {
  productId: number;
  quantity: number;
}

// Response DTO (you'll likely need this)
export interface OrderItemResponseDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}