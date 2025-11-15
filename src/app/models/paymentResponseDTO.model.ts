import { OnlinePaymentType } from './online-payment-type.enum';
import { PaymentMethod } from './PaymentMethod';
import { PaymentOption } from './paymentOption.model';
import { PaymentStatus } from './paymentStatus.model';

export interface PaymentResponseDTO {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentOption?: PaymentOption;
  onlinePaymentType?: OnlinePaymentType;
  transactionId?: string;
  status: PaymentStatus;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}