// src/types/invoiceTypes.ts
export interface Item {
  id?: number;
  itemName: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface InvoiceDto {
  id?: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceTerms: string;
  dueDate: string;
  invoiceCompanyName: string;
  invoiceCompanyAddress?: string;
  invoiceCountry?: string;
  invoicePinCode?: string;
  invoiceEmail?: string;
  invoiceMobileNo?: string;
  invoiceConsultantName?: string;
  invoiceCurrency: string;
  InvoiceStatus: string;
  companyName: string;
  companyAddress: string;
  companyMobileNo: string;
  companyEmail: string;
  totalAmount: string;
  thanksNote: string;
  items: Item[];
  clientName?: string;
}

export interface InvoiceData {
  invoiceDate: string;
  invoiceTerms: string;
  dueDate: string;
  invoiceCompanyName: string;
  invoiceCompanyAddress: string;
  invoiceCountry?: string;
  invoicePinCode?: string;
  invoiceEmail?: string;
  invoiceMobileNo?: string;
  invoiceConsultantName?: string;
  invoiceCurrency: string;
  InvoiceStatus: string;
  companyName: string;
  companyAddress: string;
  companyMobileNo: string;
  companyEmail: string;
  thanksNote: string;
  description: string;
  items: {
    itemName: string;
    description?: string;
    qty: number;
    rate: number;
    amount: number;
  }[];
  clientName?: string;
}
