import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        © 2025 Tribucore. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default MainLayout;