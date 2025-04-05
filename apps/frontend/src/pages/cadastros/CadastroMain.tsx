import React from "react";
import { useNavigate } from "react-router-dom";

const CadastroMain: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <h1 className="text-3xl font-bold mb-8">Cadastros</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => navigate('/cadastros/bancos')}
              className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition-colors"
            >
              Cadastro de Bancos
            </button>
          </div>
        </div>
      );
}

export default CadastroMain;