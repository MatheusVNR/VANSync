import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';
import WizardCartaVan from './pages/wizard/WizardCartaVan';
import CadastroBancos from './pages/cadastros/CadastroBancos';
import CadastroMain from './pages/cadastros/CadastroMain';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          } />
          <Route path="/cadastros" element={
            <ProtectedRoute requireAdmin>
              <CadastroMain/>
            </ProtectedRoute>
          } />
          <Route path="/cadastros/bancos" element={
            <ProtectedRoute requireAdmin>
              <CadastroBancos />
            </ProtectedRoute>
          } />
          <Route path="/carta-van" element={
            <ProtectedRoute>
              <WizardCartaVan />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;