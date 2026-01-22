
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_DOC_DATA, COLORS, PAYMENT_PROFILES } from './constants';
import ReceiptDocument from './components/ReceiptDocument';
import { DocumentData, ServiceItem } from './types';

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const App: React.FC = () => {
  const [docData, setDocData] = useState<DocumentData>(DEFAULT_DOC_DATA);
  const [loadingRate, setLoadingRate] = useState(false);

  // Handle Currency Changes: Exchange Rate & Payment Details
  useEffect(() => {
    // 1. Switch Payment Profile based on Currency
    const newPaymentDetails = PAYMENT_PROFILES[docData.currency as keyof typeof PAYMENT_PROFILES];
    
    // 2. Handle Exchange Rate
    if (docData.currency === 'BRL') {
      setDocData(prev => ({ 
        ...prev, 
        paymentDetails: { ...prev.paymentDetails, ...newPaymentDetails },
        exchangeRate: 1 
      }));
      return;
    }

    const fetchRate = async () => {
      setLoadingRate(true);
      try {
        const pair = `${docData.currency}-BRL`;
        const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${pair}`);
        const data = await response.json();
        const key = `${docData.currency}BRL`;
        if (data[key]) {
          const rate = parseFloat(data[key].bid);
          setDocData(prev => ({ 
            ...prev, 
            paymentDetails: { ...prev.paymentDetails, ...newPaymentDetails },
            exchangeRate: rate 
          }));
        } else {
             // Fallback if API fails but we still need to switch profile
             setDocData(prev => ({ 
                ...prev, 
                paymentDetails: { ...prev.paymentDetails, ...newPaymentDetails }
              }));
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate", error);
        // Fallback: switch profile anyway
        setDocData(prev => ({ 
            ...prev, 
            paymentDetails: { ...prev.paymentDetails, ...newPaymentDetails }
        }));
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRate();
  }, [docData.currency]);

  const handlePrint = () => {
    window.print();
  };

  const handleFieldChange = (field: keyof DocumentData, value: string | number) => {
    setDocData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: string | number) => {
    const updatedServices = [...docData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setDocData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    const newService: ServiceItem = { description: 'Novo Serviço', quantity: 1, price: 0 };
    setDocData(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const removeService = (index: number) => {
    const updatedServices = docData.services.filter((_, i) => i !== index);
    setDocData(prev => ({ ...prev, services: updatedServices }));
  };

  const exportAsHTML = () => {
    const docElement = document.getElementById('receipt-document');
    if (!docElement) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('\n');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recibo - ${docData.receiptNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          ${styles}
          <style>
            body { font-family: 'Montserrat', sans-serif; background: #fff; }
            .print-area { box-shadow: none !important; border: none !important; margin: 0 auto !important; }
            @media print { .no-print { display: none !important; } }
          </style>
      </head>
      <body>
          <div class="p-4 md:p-12">
            ${docElement.outerHTML}
          </div>
          <div class="no-print text-center mt-8 pb-12">
            <button onclick="window.print()" style="background:${COLORS.primary}; color:white; padding: 14px 32px; border-radius: 12px; font-weight: bold; cursor: pointer; border: none; box-shadow: 0 10px 15px -3px rgba(160, 39, 246, 0.3);">
              Imprimir PDF (Ctrl+P)
            </button>
          </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_${docData.receiptNumber}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 no-print flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}>
            P
          </div>
          <div>
            <h2 className="text-slate-800 font-bold leading-none">Editor de Recibo</h2>
            <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-semibold">Customização Total Ativada</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportAsHTML}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Exportar HTML</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-white font-bold shadow-lg transition-transform active:scale-95 hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            <PrintIcon />
            <span className="hidden sm:inline">Gerar PDF</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Full Editor Sidebar */}
        <aside className="lg:w-[400px] bg-white border-r border-slate-200 no-print overflow-y-auto h-[calc(100vh-73px)] custom-scrollbar">
          <div className="p-6 space-y-8 pb-32">
            
            {/* Header Data Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-purple-500"></span>
                Identificação do Recibo
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Empresa Emitente</label>
                  <input
                    type="text"
                    value={docData.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Número</label>
                    <input
                      type="text"
                      value={docData.receiptNumber}
                      onChange={(e) => handleFieldChange('receiptNumber', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Data</label>
                    <input
                      type="text"
                      value={docData.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Link de Orçamento (Referência)</label>
                  <input
                    type="text"
                    value={docData.budgetLink}
                    onChange={(e) => handleFieldChange('budgetLink', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </section>

             {/* Currency Section - NEW */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                Moeda e Conversão
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase">Moeda Base (Entrada)</label>
                   <select 
                      value={docData.currency}
                      onChange={(e) => handleFieldChange('currency', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                   >
                     <option value="BRL">Real (BRL)</option>
                     <option value="USD">Dólar (USD)</option>
                     <option value="EUR">Euro (EUR)</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                     Taxa de Câmbio
                     {loadingRate && <span className="animate-spin text-purple-600">↻</span>}
                   </label>
                   <input
                      type="number"
                      step="0.0001"
                      value={docData.exchangeRate}
                      onChange={(e) => handleFieldChange('exchangeRate', parseFloat(e.target.value) || 1)}
                      disabled={docData.currency === 'BRL'}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 ${docData.currency === 'BRL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                   />
                </div>
              </div>
              {docData.currency !== 'BRL' && (
                <p className="text-[10px] text-slate-400 italic">
                  * A taxa é atualizada automaticamente para a cotação atual. Você pode ajustá-la manualmente se precisar de uma taxa histórica específica para a data do orçamento.
                </p>
              )}
            </section>

            {/* Client Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-pink-500"></span>
                Informações do Cliente
              </h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nome / Documento do Cliente</label>
                <input
                  type="text"
                  value={docData.client}
                  onChange={(e) => handleFieldChange('client', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  placeholder="Ex: Nome da Empresa / CNPJ"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Detalhes do Serviço (Título)</label>
                <input
                  type="text"
                  value={docData.serviceDetails || ''}
                  onChange={(e) => handleFieldChange('serviceDetails', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  placeholder="Ex: Consultoria em Marketing Digital"
                />
              </div>
            </section>

             {/* Signature Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                Assinatura
              </h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Link da Assinatura (Imagem)</label>
                <input
                  type="text"
                  value={docData.signatureImage || ''}
                  onChange={(e) => handleFieldChange('signatureImage', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-slate-300"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Nome na Assinatura</label>
                <input
                  type="text"
                  value={docData.signature}
                  onChange={(e) => handleFieldChange('signature', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                />
              </div>
            </section>

            {/* Services Management */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2 bg-yellow-500"></span>
                  Itens do Serviço ({docData.currency})
                </h3>
                <button 
                  onClick={addService}
                  className="p-1.5 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
                  title="Adicionar Item"
                >
                  <PlusIcon />
                </button>
              </div>
              
              <div className="space-y-4">
                {docData.services.map((service, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                    <button 
                      onClick={() => removeService(idx)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <TrashIcon />
                    </button>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase">Descrição</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Qtd</label>
                        <input
                          type="number"
                          value={service.quantity}
                          onChange={(e) => handleServiceChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase">Preço Unit. ({docData.currency})</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(idx, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Live Preview Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center">
          <div className="relative h-fit">
            <ReceiptDocument data={docData} />
            
            {/* Guide markers */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-slate-300 pointer-events-none no-print opacity-30"></div>
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-slate-300 pointer-events-none no-print opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-slate-300 pointer-events-none no-print opacity-30"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-slate-300 pointer-events-none no-print opacity-30"></div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;
