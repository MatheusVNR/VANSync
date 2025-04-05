import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CartaFormProps {
  banco: { nome: string };
  onSubmit: (values: any) => void;
  onBack: () => void;
}

const validationSchema = Yup.object({
  cnpjSoftwareHouse: Yup.string().required('Obrigatório'),
  cnpjEmitente: Yup.string().required('Obrigatório'),
  razaoSocial: Yup.string().required('Obrigatório'),
  nomeResponsavel: Yup.string().required('Obrigatório'),
  cargoResponsavel: Yup.string().required('Obrigatório'),
  telefone: Yup.string().required('Obrigatório'),
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  agencia: Yup.string().required('Obrigatório'),
  agenciaDV: Yup.string(),
  conta: Yup.string().required('Obrigatório'),
  contaDV: Yup.string().required('Obrigatório'),
  convenio: Yup.string().required('Obrigatório'),
  cnab: Yup.string().required('Obrigatório'),
  nomeGerente: Yup.string().required('Obrigatório'),
  telefoneGerente: Yup.string().required('Obrigatório'),
  emailGerente: Yup.string().email('Email inválido').required('Obrigatório'),
});

const CartaForm: React.FC<CartaFormProps> = ({ banco, onSubmit, onBack }) => {
  const formik = useFormik({
    initialValues: {
      cnpjSoftwareHouse: '',
      cnpjEmitente: '',
      razaoSocial: '',
      nomeResponsavel: '',
      cargoResponsavel: '',
      telefone: '',
      email: '',
      agencia: '',
      agenciaDV: '',
      conta: '',
      contaDV: '',
      convenio: '',
      cnab: '',
      nomeGerente: '',
      telefoneGerente: '',
      emailGerente: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const renderField = (name: string, label: string, type: string = 'text') => (
    <div>
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={(formik.values as any)[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full p-2 border rounded ${formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors] ? 'border-red-500' : ''}`}
      />
      {formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors] && (
        <div className="text-red-500 text-sm">{formik.errors[name as keyof typeof formik.errors]}</div>
      )}
    </div>
  );

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Preenchimento da Carta</h2>

      {renderField('cnpjSoftwareHouse', 'CNPJ Software House')}
      {renderField('cnpjEmitente', 'CNPJ Emitente')}
      {renderField('razaoSocial', 'Razão Social')}
      {renderField('nomeResponsavel', 'Nome Responsável')}
      {renderField('cargoResponsavel', 'Cargo Responsável')}
      {renderField('telefone', 'Telefone')}
      {renderField('email', 'E-mail', 'email')}
      <div>
        <label className="block text-gray-700">Banco</label>
        <input
          type="text"
          value={banco.nome}
          readOnly
          className="w-full p-2 border rounded bg-gray-200"
        />
      </div>
      {renderField('agencia', 'Agência')}
      {renderField('agenciaDV', 'Agência DV')}
      {renderField('conta', 'Conta')}
      {renderField('contaDV', 'Conta DV')}
      {renderField('convenio', 'Convênio')}

      <div>
        <label className="block text-gray-700">CNAB</label>
        <select
          name="cnab"
          value={formik.values.cnab}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full p-2 border rounded ${formik.touched.cnab && formik.errors.cnab ? 'border-red-500' : ''}`}
        >
          <option value="">Selecione</option>
          <option value="CNAB240">CNAB240</option>
          <option value="CNAB400">CNAB400</option>
          <option value="CNAB444">CNAB444</option>
        </select>
        {formik.touched.cnab && formik.errors.cnab && (
          <div className="text-red-500 text-sm">{formik.errors.cnab}</div>
        )}
      </div>

      {renderField('nomeGerente', 'Nome Gerente')}
      {renderField('telefoneGerente', 'Telefone Gerente')}
      {renderField('emailGerente', 'E-mail Gerente', 'email')}

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="text-gray-700 hover:underline">
          Voltar
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Revisar
        </button>
      </div>
    </form>
  );
};

export default CartaForm;