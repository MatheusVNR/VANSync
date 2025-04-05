import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-8">Bem-vindo ao VANSync</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => navigate('/carta-van')}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors"
        >
          Gerar Carta VAN
        </button>
        <button
          onClick={() => navigate('/cadastros')}
          className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition-colors"
        >
          Cadastros
        </button>
      </div>
    </div>
  );
};

export default MainMenu;