import * as Joi from 'joi';

export const registerClientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  cpf: Joi.string().length(11).required(),
  email: Joi.string().email().required(),
  color: Joi.string().min(3).max(20).required(),
  annotations: Joi.string().allow('').optional(),
});
