import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { maskCNPJ, maskPhone, maskCEP, maskToken } from '../utils/masks';

interface InputMaskedProps extends Omit<TextFieldProps, 'onChange'> {
  mask?: 'cnpj' | 'phone' | 'cep' | 'token';
  onChange: (value: string) => void;
  value: string;
}

const InputMasked: React.FC<InputMaskedProps> = ({
  mask,
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let maskedValue = inputValue;

    // Aplicar máscara baseada no tipo
    switch (mask) {
      case 'cnpj':
        maskedValue = maskCNPJ(inputValue);
        break;
      case 'phone':
        maskedValue = maskPhone(inputValue);
        break;
      case 'cep':
        maskedValue = maskCEP(inputValue);
        break;
      case 'token':
        maskedValue = maskToken(inputValue);
        break;
      default:
        maskedValue = inputValue;
    }

    onChange(maskedValue);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#18A3E0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0353B3',
          },
        },
      }}
    />
  );
};

export default InputMasked; 