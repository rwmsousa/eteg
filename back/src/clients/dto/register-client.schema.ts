import * as Joi from 'joi';

export const registerClientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Nome deve ser um texto',
    'string.empty': 'Nome não pode estar vazio',
    'string.min': 'Nome deve ter pelo menos {#limit} caracteres',
    'string.max': 'Nome deve ter no máximo {#limit} caracteres',
    'any.required': 'Nome obrigatório',
  }),
  cpf: Joi.string().length(11).required().messages({
    'string.base': 'CPF deve ser um texto',
    'string.empty': 'CPF não pode estar vazio',
    'string.length': 'CPF deve ter exatamente {#limit} caracteres',
    'any.required': 'CPF obrigatório',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email deve ser um texto',
    'string.empty': 'Email não pode estar vazio',
    'string.email': 'Email deve ser um email válido',
    'any.required': 'Email obrigatório',
  }),
  color: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Cor deve ser um texto',
    'string.empty': 'Cor não pode estar vazio',
    'string.min': 'Cor deve ter pelo menos {#limit} caracteres',
    'string.max': 'Cor deve ter no máximo {#limit} caracteres',
    'any.required': 'Cor obrigatório',
  }),
  annotations: Joi.string().allow('').optional().messages({
    'string.base': 'Anotações deve ser um texto',
  }),
});
