import React, { useState, useEffect } from 'react';
import { getBancos, createBanco, updateBanco, deleteBanco } from '../../services/bancoService';
import BancoForm from '../../components/cadastros/BancoForm';

interface Banco {
  codigo: number;
  nome: string;
  padrao_van: string;
  cnab240?: boolean;
  cnab400?: boolean;
  cnab444?: boolean;
  produtos?: string;
}

const CadastroBancos: React.FC = () => {
  const [bancos, setBanks] = useState<Banco[]>([]);
  const [editingBank, setEditingBank] = useState<Banco | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBanks = async () => {
    try {
      const data = await getBancos();
      setBanks(data);
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createBanco(data);
      setShowForm(false);
      fetchBanks();
    } catch (error) {
      console.error('Erro ao criar banco:', error);
    }
  };

  const handleUpdate = async (data: any) => {
    if (editingBank) {
      try {
        await updateBanco(editingBank.codigo, data);
        setEditingBank(null);
        setShowForm(false);
        fetchBanks();
      } catch (error) {
        console.error('Erro ao atualizar banco:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este banco?')) {
      try {
        await deleteBanco(id);
        fetchBanks();
      } catch (error) {
        console.error('Erro ao excluir banco:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Bancos</h1>

        {!showForm && !editingBank && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Novo Banco
            </button>
          </div>
        )}

        {(showForm || editingBank) && (
          <div className="mb-6">
            <BancoForm
              initialData={editingBank ? { ...editingBank } : undefined}
              onSubmit={editingBank ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingBank(null);
              }}
            />
          </div>
        )}

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Código</th>
                <th className="py-2 px-4">Nome</th>
                <th className="py-2 px-4">Padrão VAN</th>
                <th className="py-2 px-4">CNAB 240</th>
                <th className="py-2 px-4">CNAB 400</th>
                <th className="py-2 px-4">CNAB 444</th>
                <th className="py-2 px-4">Produtos</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bancos.map((bank) => (
                <tr key={bank.codigo} className="border-b">
                  <td className="py-2 px-4">{bank.codigo.toString().padStart(3, '0')}</td>
                  <td className="py-2 px-4">{bank.nome}</td>
                  <td className="py-2 px-4">{bank.padrao_van}</td>
                  <td className="py-2 px-4">{bank.cnab240 ? 'Sim' : 'Não'}</td>
                  <td className="py-2 px-4">{bank.cnab400 ? 'Sim' : 'Não'}</td>
                  <td className="py-2 px-4">{bank.cnab444 ? 'Sim' : 'Não'}</td>
                  <td className="py-2 px-4">{bank.produtos}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => {
                        setEditingBank(bank);
                        setShowForm(true);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(bank.codigo)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {bancos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Nenhum banco cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CadastroBancos;