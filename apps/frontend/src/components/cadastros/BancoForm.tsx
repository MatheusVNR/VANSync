import React, { useState } from 'react';

interface BancoFormProps {
  initialData?: {
    nome: string;
    padrao_van: string;
    cnab240?: boolean;
    cnab400?: boolean;
    cnab444?: boolean;
    produtos?: string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const BancoForm: React.FC<BancoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [padraoVan, setPadraoVan] = useState(initialData?.padrao_van || '');
  const [cnab240, setCnab240] = useState(initialData?.cnab240 || false);
  const [cnab400, setCnab400] = useState(initialData?.cnab400 || false);
  const [cnab444, setCnab444] = useState(initialData?.cnab444 || false);
  const [produtos, setProdutos] = useState(initialData?.produtos || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      padrao_van: padraoVan,
      cnab240,
      cnab400,
      cnab444,
      produtos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <div className="mb-4">
        <label className="block text-gray-700">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Banco"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Padrão VAN</label>
        <input
          type="text"
          value={padraoVan}
          onChange={(e) => setPadraoVan(e.target.value)}
          placeholder="Padrão VAN"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={cnab240}
          onChange={(e) => setCnab240(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-700">CNAB 240</span>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={cnab400}
          onChange={(e) => setCnab400(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-700">CNAB 400</span>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={cnab444}
          onChange={(e) => setCnab444(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-700">CNAB 444</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Produtos</label>
        <input
          type="text"
          value={produtos}
          onChange={(e) => setProdutos(e.target.value)}
          placeholder="Ex: Boletos, Pagamentos"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Salvar
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default BancoForm;