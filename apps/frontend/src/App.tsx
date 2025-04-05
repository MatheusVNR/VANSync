import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';
import WizardCartaVan from './pages/wizard/WizardCartaVan';
import CadastroBancos from './pages/cadastros/CadastroBancos';
import CadastroMain from './pages/cadastros/CadastroMain';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/cadastros" element={<CadastroMain/>} />
        <Route path="/cadastros/bancos" element={<CadastroBancos />} />
        <Route path="/carta-van" element={<WizardCartaVan />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;