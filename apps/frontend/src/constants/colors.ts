export const TECNOSPEED_COLORS = {
  // Cores principais
  AZUL_1: '#0353B3',
  AZUL_2: '#18A3E0',
  AZUL_3: '#0F1827',
  BRANCO: '#FFFFFF',
  
  // Cores de estado
  SUCESSO: '#4CAF50',
  ERRO: '#F44336',
  AVISO: '#FF9800',
  INFO: '#2196F3',
  
  // Cores neutras
  CINZA_100: '#F5F5F5',
  CINZA_200: '#EEEEEE',
  CINZA_300: '#E0E0E0',
  CINZA_400: '#BDBDBD',
  CINZA_500: '#9E9E9E',
  CINZA_600: '#757575',
  CINZA_700: '#616161',
  CINZA_800: '#424242',
  CINZA_900: '#212121',
  
  // Cores de texto
  TEXTO_PRIMARIO: '#0F1827',
  TEXTO_SECUNDARIO: '#666666',
  TEXTO_DESABILITADO: '#9E9E9E',
  
  // Cores de fundo
  FUNDO_PRIMARIO: '#FFFFFF',
  FUNDO_SECUNDARIO: '#F5F5F5',
  FUNDO_CARD: '#FFFFFF',
  
  // Cores de borda
  BORDA_PRIMARIA: '#E0E0E0',
  BORDA_SECUNDARIA: '#BDBDBD',
  BORDA_FOCUS: '#18A3E0',
} as const;

export type TecnospeedColor = keyof typeof TECNOSPEED_COLORS; 