import { CartItemResponseDTO } from "./cart-item.model";


// Request DTO
export interface CartRequestDTO {
  userId: number;
}

// Response DTO
export interface CartResponseDTO {
  id: number;
  userName: string;
  totalItems: number;
  totalPrice: number;
  items: CartItemResponseDTO[];
}