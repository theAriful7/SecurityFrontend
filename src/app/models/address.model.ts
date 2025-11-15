export interface AddressRequestDTO {
  user_id: number;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  phone: string;
}


export interface AddressResponseDTO {
  id: number;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
  phone: string;
}