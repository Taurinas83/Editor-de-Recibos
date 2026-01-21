
export const COLORS = {
  primary: '#A027F6',
  secondary: '#E22ABA',
  accent1: '#FFC200',
  accent2: '#FF8B06',
  accent3: '#02FFCC',
  accent4: '#26EBEB',
};

export const DEFAULT_DOC_DATA = {
  companyName: 'PREDMED Portimão',
  receiptNumber: '20251222-001',
  date: '22 de Dezembro de 2025',
  client: 'Paulo e Sara',
  budgetLink: 'https://sites.google.com/view/proposta-prontmed/proposta',
  signature: 'Tiago Taurian Design',
  signatureImage: '',
  paymentDetails: {
    beneficiary: 'TIAGO TAURIAN VIANA',
    bankName: 'Wise Brasil Instituição de Pagamento Ltda.',
    bankCode: '40571694',
    accountType: 'Conta Pagamento',
    agency: '0001',
    accountNumber: '36651195',
    pixKey: '361477ef-a092-4062-97c6-333ff7fcfbaa',
    paymentLink: 'https://wise.com/pay/me/tiagot1047',
    qrCodeUrl: 'https://i.imgur.com/u9LskSc.png', // Converted to direct image link for rendering
  },
  services: [
    { description: 'Assinaturas de Email', quantity: 6, price: 35.00 },
    { description: 'Arte de cartão de Visitas', quantity: 1, price: 60.00 },
    { description: 'Placas de vendas impressas', quantity: 5, price: 45.00 },
    { description: 'Posts para instagram', quantity: 4, price: 40.00 },
    { description: 'Slides para ppt', quantity: 3, price: 50.00 },
    { description: 'Padronização de logo', quantity: 1, price: 90.00 },
  ],
};
