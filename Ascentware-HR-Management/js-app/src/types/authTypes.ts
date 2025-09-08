export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  user: User;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Optional
};

export interface LoginFormData {
  Email: string;
  Password: string;
}

export interface Payment {
  id: string;
  invoiceNo: string;
  invoiceAmount: number;
  paymentAmount: number;
  paymentDate: string;
}

export interface Client {
  id?: number;
  companyName: string;
  contactName: string;
  companyAddress: string;
  companyCountry: string;
  companyPinCode: number;
  companyEmail: string;
  companyMobileNo: string;
  logoUrl: string;
}
