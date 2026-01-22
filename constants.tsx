
export const COLORS = {
  primary: '#A027F6',
  secondary: '#E22ABA',
  accent1: '#FFC200',
  accent2: '#FF8B06',
  accent3: '#02FFCC',
  accent4: '#26EBEB',
};

export const PAYMENT_PROFILES = {
  BRL: {
    beneficiary: 'TIAGO TAURIAN VIANA',
    bankName: 'Wise Brasil Instituição de Pagamento Ltda.',
    bankCode: '40571694',
    accountType: 'Conta Pagamento',
    agency: '0001',
    accountNumber: '36651195',
    pixKey: '361477ef-a092-4062-97c6-333ff7fcfbaa',
    paymentLink: 'https://wise.com/pay/me/tiagot1047',
    qrCodeUrl: 'https://i.imgur.com/u9LskSc.png',
  },
  USD: {
    beneficiary: 'Tiago Taurian Viana',
    bankName: 'Wise US Inc',
    bankAddress: '108 W 13th St, Wilmington, DE, 19801, United States',
    accountType: 'Deposit',
    accountNumber: '447046528729505',
    routingNumber: '084009519',
    swift: 'TRWIUS35XXX',
    paymentLink: 'https://wise.com/pay/me/tiagot1047',
    qrCodeUrl: '', // No standard QR code for US transfers usually
  },
  EUR: {
    beneficiary: 'Tiago Taurian Viana',
    bankName: 'Wise',
    bankAddress: 'Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium',
    iban: 'BE75 9675 2764 0051',
    swift: 'TRWIBEB1XXX',
    accountType: 'Current Account',
    paymentLink: 'https://wise.com/pay/me/tiagot1047',
    qrCodeUrl: '',
  }
};

export const DEFAULT_DOC_DATA = {
  companyName: 'PREDMED Portimão',
  receiptNumber: '20251222-001',
  date: '22 de Dezembro de 2025',
  client: 'Paulo e Sara',
  serviceDetails: 'Criação de Identidade Visual e Materiais Gráficos',
  budgetLink: 'https://sites.google.com/view/proposta-prontmed/proposta',
  signature: 'Tiago Taurian Design',
  signatureImage: '',
  currency: 'BRL',
  exchangeRate: 1,
  paymentDetails: PAYMENT_PROFILES.BRL,
  services: [
    { description: 'Assinaturas de Email', quantity: 6, price: 35.00 },
    { description: 'Arte de cartão de Visitas', quantity: 1, price: 60.00 },
    { description: 'Placas de vendas impressas', quantity: 5, price: 45.00 },
    { description: 'Posts para instagram', quantity: 4, price: 40.00 },
    { description: 'Slides para ppt', quantity: 3, price: 50.00 },
    { description: 'Padronização de logo', quantity: 1, price: 90.00 },
  ],
};
