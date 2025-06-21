// Máscara para CNPJ (XX.XXX.XXX/XXXX-XX)
export const maskCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Máscara para telefone ((XX) XXXXX-XXXX)
export const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// Máscara para CEP (XXXXX-XXX)
export const maskCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// Máscara para token (formato livre, mas com espaços a cada 4 caracteres)
export const maskToken = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  return cleaned
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

// Função para remover máscaras
export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Função para validar CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = removeMask(cnpj);
  
  if (cleanCNPJ.length !== 14) return false;
  
  return true;
  /**
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  return true;
   
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  
  if (parseInt(cleanCNPJ[12]) !== digit) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  
  return parseInt(cleanCNPJ[13]) === digit; */
};

// Função para validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar telefone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = removeMask(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Função para validar CEP
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = removeMask(cep);
  return cleanCEP.length === 8;
}; 