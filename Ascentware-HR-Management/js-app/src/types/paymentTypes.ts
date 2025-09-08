export interface Payment {
  id: string;
  invoiceNo: string;
  paymentAmount: number | null;
  paymentDate: string;
  paymentMethod: string;
  referenceNo: string;
}

export interface PaymentForm {
  invoiceNo: string;
  paymentAmount: string;
  paymentDate: string;
  paymentMethod: string;
  referenceNo: string;
}
