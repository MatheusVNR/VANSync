import { Box } from '@mui/material';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode; // Sidebar opcional
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar }) => {
  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar opcional */}
        {sidebar && (
          <Box
            sx={{
              width: '300px',
              position: 'fixed',
              top: '64px',
              left: 0,
              bottom: 0,
              overflowY: 'auto',
              backgroundColor: 'background.paper',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            {sidebar}
          </Box>
        )}

        {/* Conteúdo principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 4,
            marginTop: '64px',
            marginLeft: sidebar ? '300px' : 0,
            transition: 'margin 0.3s',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer fixo */}
      <footer className="bg-gray-200 text-center p-4">
        © 2025 Tribucore. Todos os direitos reservados.
      </footer>
    </Box>
  );
};

export default MainLayout;
