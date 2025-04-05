import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface Banco {
  codigo: number;
  nome: string;
  padrao_van: string;
  cnab240: boolean;
  cnab400: boolean;
  cnab444: boolean;
  produtos: string;
}

interface BancoSelectionProps {
  onBancoSelected: (bank: Banco) => void;
}

const BancoSelection: React.FC<BancoSelectionProps> = ({ onBancoSelected }) => {
  const [termoDeBusca, setTermoDeBusca] = useState('');
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [bancosFiltrados, setBancosFiltrados] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBancos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}banco`);
        setBancos(response.data);
        setBancosFiltrados(response.data);
      } catch (error) {
        console.error('Erro ao buscar bancos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBancos();
  }, []);

  useEffect(() => {
    const filtered = bancos.filter((bank) =>
      bank.nome.toLowerCase().includes(termoDeBusca.toLowerCase()) ||
      bank.codigo.toString().includes(termoDeBusca)
    );
    setBancosFiltrados(filtered);
  }, [termoDeBusca, bancos]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seleção de Banco</h2>
      <input
        type="text"
        placeholder="Digite para buscar..."
        value={termoDeBusca}
        onChange={(e) => setTermoDeBusca(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      {loading && <p>Carregando...</p>}
      {bancosFiltrados.length === 0 && !loading ? (
        <p className="text-red-500">Banco não encontrado</p>
      ) : (
        <ul className="space-y-2">
          {bancosFiltrados.map((bank) => (
            <li
              key={bank.codigo}
              onClick={() => onBancoSelected(bank)}
              className="cursor-pointer p-2 border rounded hover:bg-gray-100"
            >
              {bank.codigo.toString().padStart(3, '0')} - {bank.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BancoSelection;