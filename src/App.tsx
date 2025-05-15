import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { VanProvider } from './contexts/VanContext';
import Login from './pages/Login';
import BankSelection from './pages/BankSelection';
import ProductSelection from './pages/ProductSelection';
import CompanyData from './pages/CompanyData';
import ReviewData from './pages/ReviewData';
import Success from './pages/Success';

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VanProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/bank-selection" element={<BankSelection />} />
            <Route path="/product-selection" element={<ProductSelection />} />
            <Route path="/company-data" element={<CompanyData />} />
            <Route path="/review" element={<ReviewData />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Router>
      </VanProvider>
    </ThemeProvider>
  );
}

export default App; 