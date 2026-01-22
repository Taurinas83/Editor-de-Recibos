
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
  serviceDetails?: string; // New field for service description/details
  budgetLink: string;
  services: ServiceItem[];
  signature: string;
  signatureImage?: string;
  currency: 'BRL' | 'USD' | 'EUR';
  exchangeRate: number;
  paymentDetails: {
    beneficiary: string;
    bankName: string;
    bankAddress?: string; // New: For Int'l banks
    bankCode?: string; // BRL specific
    accountType?: string;
    agency?: string; // BRL specific
    accountNumber?: string; // BRL and USD
    iban?: string; // EUR specific
    swift?: string; // Int'l specific
    routingNumber?: string; // USD specific
    pixKey?: string; // BRL specific
    paymentLink: string;
    qrCodeUrl?: string; // BRL specific
  };
}
