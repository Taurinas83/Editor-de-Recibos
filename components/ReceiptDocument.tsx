
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { DocumentData } from '../types';

interface ReceiptDocumentProps {
  data: DocumentData;
}

const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({ data }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [data.signatureImage]);

  const calculateTotal = () => {
    // Total is calculated in the base currency (e.g. USD) then converted to BRL
    const subtotal = data.services.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    return subtotal * (data.exchangeRate || 1);
  };

  const getConvertedPrice = (price: number) => {
    return price * (data.exchangeRate || 1);
  };

  const formatImageUrl = (url: string | undefined) => {
    if (!url) return '';
    // Fix common issue where users paste the Imgur page link instead of the direct image link
    if (url.includes('imgur.com') && !url.includes('i.imgur.com')) {
       const id = url.split('/').pop();
       if (id && !id.includes('.')) {
         return `https://i.imgur.com/${id}.png`;
       }
    }
    return url;
  };

  const signatureUrl = formatImageUrl(data.signatureImage);
  const totalValue = calculateTotal();

  return (
    <div id="receipt-document" className="bg-white p-12 shadow-2xl mx-auto max-w-4xl print-area min-h-[1123px] relative flex flex-col border-t-8" style={{ borderColor: COLORS.primary }}>
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-opacity-5 pointer-events-none rounded-bl-full overflow-hidden">
        <div className="w-full h-full opacity-10" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase" style={{ color: COLORS.primary }}>
            {data.companyName}
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">RECIBO DE PRESTAÇÃO DE SERVIÇOS</p>
        </div>
        <div className="text-right">
          <div className="p-4 rounded-lg inline-block" style={{ backgroundColor: `${COLORS.primary}10` }}>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Recibo Nº</p>
            <p className="text-lg font-mono font-bold" style={{ color: COLORS.primary }}>{data.receiptNumber}</p>
          </div>
        </div>
      </div>

      {/* Client Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-12 border-b border-gray-100 pb-12">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cliente</h3>
          <p className="text-xl font-semibold text-gray-800 mb-4">{data.client}</p>
          
          {data.serviceDetails && (
             <div className="mt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Referente à</h3>
                <p className="text-base font-medium text-gray-700 leading-snug">{data.serviceDetails}</p>
             </div>
          )}
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Data de Emissão</h3>
          <p className="text-xl font-semibold text-gray-800">{data.date}</p>
        </div>
      </div>

      {/* Services Table */}
      <div className="flex-grow">
        <table className="w-full text-left mb-6">
          <thead>
            <tr className="border-b-2" style={{ borderColor: COLORS.accent4 }}>
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Descrição</th>
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Qtd</th>
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Unitário {data.currency !== 'BRL' ? '(R$)' : ''}</th>
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Subtotal {data.currency !== 'BRL' ? '(R$)' : ''}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.services.map((item, idx) => {
              const unitPriceBRL = getConvertedPrice(item.price);
              const subtotalBRL = getConvertedPrice(item.price * item.quantity);
              
              return (
                <tr key={idx}>
                  <td className="py-4">
                    <span className="font-semibold text-gray-800 block">{item.description}</span>
                  </td>
                  <td className="py-4 text-center font-medium text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right font-medium text-gray-800">
                    R$ {unitPriceBRL.toFixed(2).replace('.', ',')}
                    {data.currency !== 'BRL' && (
                        <span className="block text-[9px] text-gray-400">
                            ({item.price.toFixed(2)} {data.currency})
                        </span>
                    )}
                  </td>
                  <td className="py-4 text-right font-bold text-gray-800">
                    R$ {subtotalBRL.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2" style={{ borderColor: COLORS.accent4 }}>
              <td colSpan={3} className="py-6 text-right">
                <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Valor Total Bruto</p>
                {data.currency !== 'BRL' && (
                    <p className="text-[10px] text-gray-400 mt-1">
                        Conversão: 1 {data.currency} = {data.exchangeRate.toFixed(4).replace('.', ',')} BRL
                    </p>
                )}
              </td>
              <td className="py-6 text-right text-2xl font-black" style={{ color: COLORS.primary }}>
                R$ {totalValue.toFixed(2).replace('.', ',')}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Budget Link */}
        <div className="bg-gray-50 p-6 rounded-xl border-l-4 mb-8" style={{ borderColor: COLORS.accent1 }}>
          <p className="text-sm font-semibold text-gray-500 mb-1">Referência de Orçamento:</p>
          <a href={data.budgetLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold truncate block transition-colors hover:underline" style={{ color: COLORS.primary }}>
            {data.budgetLink}
          </a>
        </div>

        {/* Payment Details Section */}
        <div className="p-8 rounded-2xl border-2 grid grid-cols-1 md:grid-cols-3 gap-8" style={{ borderColor: `${COLORS.accent3}40` }}>
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center" style={{ color: COLORS.primary }}>
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS.accent3 }}></span>
                Dados Bancários ({data.currency === 'BRL' ? 'Pix/Transferência' : 'Wise International'})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Beneficiário</p>
                  <p className="text-sm font-bold text-gray-800">{data.paymentDetails.beneficiary}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Banco / Instituição</p>
                  <p className="text-sm font-semibold text-gray-800">{data.paymentDetails.bankName}</p>
                  {data.paymentDetails.bankCode && (
                    <p className="text-[10px] text-gray-500 font-medium">Cód. Banco: {data.paymentDetails.bankCode}</p>
                  )}
                  {data.paymentDetails.bankAddress && (
                     <p className="text-[10px] text-gray-500 font-medium mt-0.5">{data.paymentDetails.bankAddress}</p>
                  )}
                </div>

                {/* Conditional Fields based on Available Data */}
                {data.paymentDetails.agency && (
                    <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Agência / Conta</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">Ag. {data.paymentDetails.agency}</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">CC. {data.paymentDetails.accountNumber}</p>
                    </div>
                )}
                
                {/* For USD/Intl without Agency but with Account Number */}
                {!data.paymentDetails.agency && data.paymentDetails.accountNumber && (
                    <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Conta ({data.paymentDetails.accountType || 'Conta'})</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">{data.paymentDetails.accountNumber}</p>
                    </div>
                )}

                {data.paymentDetails.routingNumber && (
                     <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Routing Number (ACH/Wire)</p>
                     <p className="text-sm font-mono font-semibold text-gray-800">{data.paymentDetails.routingNumber}</p>
                     </div>
                )}

                {data.paymentDetails.iban && (
                     <div className="col-span-2">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">IBAN</p>
                     <p className="text-sm font-mono font-semibold text-gray-800 break-all">{data.paymentDetails.iban}</p>
                     </div>
                )}

                {data.paymentDetails.swift && (
                     <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">SWIFT / BIC</p>
                     <p className="text-sm font-mono font-semibold text-gray-800">{data.paymentDetails.swift}</p>
                     </div>
                )}

                {data.paymentDetails.pixKey && (
                    <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Chave Pix</p>
                    <p className="text-xs font-mono font-bold text-gray-800 break-all bg-gray-100 p-2 rounded border border-gray-200">
                        {data.paymentDetails.pixKey}
                    </p>
                    </div>
                )}
              </div>
            </div>

            <div className="mt-6">
                <a href={data.paymentDetails.paymentLink} target="_blank" rel="noopener noreferrer" className="group block bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg p-3 transition-colors flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Link de Pagamento Rápido</p>
                        <p className="text-xs font-bold text-purple-700 truncate">{data.paymentDetails.paymentLink}</p>
                    </div>
                     <div className="bg-white p-1.5 rounded-full shadow-sm text-purple-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                     </div>
                </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 p-6 rounded-xl flex flex-col justify-center items-center text-center border" style={{ borderColor: `${COLORS.primary}20` }}>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total a Pagar</p>
                <p className="text-3xl font-black leading-none" style={{ color: COLORS.secondary }}>
                R$ {totalValue.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-[10px] text-gray-400 mt-2 uppercase font-medium">Isento de impostos retidos</p>
            </div>
            
            {/* Only show QR Code box if URL exists (usually only for BRL) */}
            {data.paymentDetails.qrCodeUrl ? (
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center flex-grow">
                    <img 
                        src={data.paymentDetails.qrCodeUrl} 
                        alt="QR Code Pix" 
                        className="w-32 h-32 object-contain mix-blend-multiply mb-2"
                    />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Escaneie para Pagar</p>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center flex-grow">
                     <p className="text-xs font-bold text-gray-400 text-center">Transferência Internacional</p>
                     <p className="text-[10px] text-gray-300 text-center mt-1">Use os dados ao lado para realizar a transferência via Wise ou SWIFT.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="mt-12 border-t pt-10 flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-6">Assinatura Digital</p>
          
          <div className="relative h-20 mb-2 flex items-end justify-start">
             {signatureUrl && !imgError && (
                 <img 
                    key={signatureUrl}
                    src={signatureUrl} 
                    alt="Assinatura" 
                    className="h-full object-contain -ml-4"
                    onError={() => setImgError(true)}
                 />
             )}
          </div>

          <div className="w-64 h-px bg-gray-200 mb-2"></div>
          <p className="text-lg font-bold" style={{ color: COLORS.secondary }}>{data.signature}</p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Digital Design Specialist</p>
        </div>
        
        <div className="text-right">
            <div className="flex gap-2 justify-end mb-4">
               {[COLORS.primary, COLORS.secondary, COLORS.accent1, COLORS.accent2, COLORS.accent3, COLORS.accent4].map((c, i) => (
                 <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></div>
               ))}
            </div>
            <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em]">Authentic Document • No Copy • 2025</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDocument;
