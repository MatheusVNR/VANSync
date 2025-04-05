import React, { useState } from 'react';

interface CartaPreviewProps {
  pdfUrl: string;
  produtos: string[];
  onConfirm: () => void;
  onBack: () => void;
}

const CartaPreview: React.FC<CartaPreviewProps> = ({ pdfUrl, produtos, onConfirm, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < produtos.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Validação da Carta</h2>
      <p className="mb-4">Visualizando carta para o produto: <strong>{produtos[currentIndex]}</strong></p>
      <div className="mb-4 border rounded overflow-hidden">
        <iframe src={pdfUrl} className="w-full h-96" title="Carta VAN" />
      </div>
      <div className="flex justify-between mb-4">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Anterior
        </button>
        <button onClick={handleNext} disabled={currentIndex === produtos.length - 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Próximo
        </button>
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="text-gray-700 hover:underline">
          Voltar
        </button>
        <button onClick={onConfirm} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Confirmar e Enviar Carta
        </button>
      </div>
      <div className="mt-4 p-2 bg-yellow-100 border-l-4 border-yellow-500">
        <p className="text-sm">*O limite de cartas simultâneas por Software House é de 5 solicitações (após tal limite, deverá aguardar a liberação das já abertas).</p>
      </div>
    </div>
  );
};

export default CartaPreview;