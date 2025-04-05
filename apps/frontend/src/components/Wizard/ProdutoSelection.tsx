import React, { useState } from 'react';

interface ProductSelectionProps {
  banco: { produtos: string };
  onProductsSelected: (products: string[]) => void;
  onBack: () => void;
}

const ProdutoSelection: React.FC<ProductSelectionProps> = ({ banco, onProductsSelected, onBack }) => {
  const produtosDisponiveis = banco.produtos.split(',').map((prod) => prod.trim());
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);

  const toggleProduct = (product: string) => {
    if (produtosSelecionados.includes(product)) {
      setProdutosSelecionados(produtosSelecionados.filter((p) => p !== product));
    } else {
      setProdutosSelecionados([...produtosSelecionados, product]);
    }
  };

  const handleNext = () => {
    if (produtosSelecionados.length > 0) {
      onProductsSelected(produtosSelecionados);
    } else {
      alert('Selecione ao menos um produto.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seleção de Produtos</h2>
      <div className="flex flex-wrap gap-2">
        {produtosDisponiveis.map((product) => (
          <button
            key={product}
            onClick={() => toggleProduct(product)}
            className={`px-4 py-2 rounded border transition-colors ${
              produtosSelecionados.includes(product)
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {product}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-gray-700 hover:underline">
          Voltar
        </button>
        <button onClick={handleNext} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Prosseguir
        </button>
      </div>
    </div>
  );
};

export default ProdutoSelection;