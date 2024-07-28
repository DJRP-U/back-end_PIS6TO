const Joi = require("joi");

const createDataSchema = Joi.object({
  humidity: Joi.string().required().messages({
    "*": "El campo humedad es requerido y debe ser una cadena de caracteres",
  }),
  temperature: Joi.string().required().messages({
    "*": "El campo temperatura es requerido y debe ser una cadena de caracteres",
  }),
  timestamp: Joi.date().required().messages({
    "*": "El campo timestamp es requerido y debe ser una fecha válida",
  }),
});

const editDataSchema = Joi.object({
  humidity: Joi.string().optional().messages({
    "*": "El campo humedad debe ser una cadena de caracteres",
  }),
  temperature: Joi.string().optional().messages({
    "*": "El campo temperatura debe ser una cadena de caracteres",
  }),
  timestamp: Joi.date().optional().messages({
    "*": "El campo timestamp debe ser una fecha válida",
  }),
});
const exportDataSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.base": "El campo startDate debe ser una fecha válida",
    "date.format": "El campo startDate debe estar en formato ISO",
    "any.required": "El campo startDate es obligatorio",
  }),
  endDate: Joi.date().iso().required().messages({
    "date.base": "El campo endDate debe ser una fecha válida",
    "date.format": "El campo endDate debe estar en formato ISO",
    "any.required": "El campo endDate es obligatorio",
  }),
});

module.exports = { createDataSchema, editDataSchema, exportDataSchema};
