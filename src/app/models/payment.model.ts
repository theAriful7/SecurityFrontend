import { OnlinePaymentType } from "./online-payment-type.enum";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentOption } from "./paymentOption.model";


// Request DTO
export interface PaymentRequestDTO {
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentOption?: PaymentOption;
  onlinePaymentType?: OnlinePaymentType;
  transactionId?: string;
}