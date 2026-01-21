
export interface ServiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface DocumentData {
  companyName: string;
  receiptNumber: string;
  date: string;
  client: string;
  budgetLink: string;
  services: ServiceItem[];
  signature: string;
  signatureImage?: string;
  paymentDetails: {
    beneficiary: string;
    bankName: string;
    bankCode: string;
    accountType: string;
    agency: string;
    accountNumber: string;
    pixKey: string;
    paymentLink: string;
    qrCodeUrl: string;
  };
}
