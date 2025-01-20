import * as yup from 'yup';

const clientValidationSchema = yup.object().shape({
  name: yup.string().required('Nome completo obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email obrigatório'),
  cpf: yup
    .string()
    .matches(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .required('CPF obrigatório'),
  color: yup.string().required('Cor obrigatória'),
  annotations: yup.string().optional(),
});

export default clientValidationSchema;
