import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  CircularProgress,
  Fade,
  Zoom,
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

interface PDFViewerProps {
  pdfBase64?: string;
  title: string;
  subtitle?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple?: boolean;
  currentIndex?: number;
  totalCount?: number;
  loading?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfBase64,
  title,
  subtitle,
  onNext,
  onPrev,
  hasMultiple = false,
  currentIndex = 0,
  totalCount = 1,
  loading = false,
}) => {
  const theme = useTheme();
  const [pdfSrc, setPdfSrc] = useState<string | undefined>();

  useEffect(() => {
    // Converte a string base64 para uma URL de Blob, que é mais compatível com mobile.
    if (pdfBase64) {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfSrc(url);

      // Limpa a URL do Blob quando o componente é desmontado para evitar memory leaks
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBase64]);

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ width: '100%' }}>
        {/* Header com Navegação */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PdfIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
              {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
            </Box>
          </Box>
          
          {hasMultiple && totalCount > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconButton onClick={onPrev} disabled={currentIndex === 0} size="small"><PrevIcon /></IconButton>
              <Typography variant="body2" color="text.secondary">
                {currentIndex + 1} de {totalCount}
              </Typography>
              <IconButton onClick={onNext} disabled={currentIndex === totalCount - 1} size="small"><NextIcon /></IconButton>
            </Box>
          )}
        </Box>

        {/* PDF Container */}
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            height: { xs: '70vh', sm: '75vh' },
            minHeight: '500px', // Garante altura mínima em telas muito pequenas
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Zoom in={true}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={50} sx={{ mb: 2 }} />
                <Typography>Carregando pré-visualização...</Typography>
              </Box>
            </Zoom>
          ) : pdfSrc ? (
            <Fade in={true} timeout={300}>
              <iframe
                src={pdfSrc}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={title}
                allow="fullscreen"
              />
            </Fade>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <PdfIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>PDF indisponível</Typography>
              <Typography variant="body2" color="text.disabled">A pré-visualização não pôde ser gerada.</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default PDFViewer; 