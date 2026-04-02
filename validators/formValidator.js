const Joi = require('joi');
const ApiError = require('../utils/apiError');

// Types de champs autorisés — comme un choices= en Django
const FIELD_TYPES = ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

// Schéma Joi pour un champ de formulaire
const fieldSchema = Joi.object({
    label: Joi.string().required().messages({
        'string.empty': 'Le label du champ est obligatoire',
        'any.required': 'Le label du champ est obligatoire',
    }),
    type: Joi.string().valid(...FIELD_TYPES).required().messages({
        'any.only': `Le type doit être parmi: ${FIELD_TYPES.join(', ')}`,
        'any.required': 'Le type du champ est obligatoire',
    }),
    options: Joi.array().items(Joi.string()).default([]),
    required: Joi.boolean().default(false),
});

// Schéma Joi pour un formulaire complet
const formSchema = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Le titre est obligatoire',
        'string.min': 'Le titre doit contenir au moins 3 caractères',
        'string.max': 'Le titre ne peut pas dépasser 200 caractères',
        'any.required': 'Le titre est obligatoire',
    }),
    fields: Joi.array().items(fieldSchema).min(1).required().messages({
        'array.min': 'Le formulaire doit contenir au moins 1 champ',
        'any.required': 'Les champs sont obligatoires',
    }),
});

// Middleware de validation — comme Serializer.is_valid() en DRF
const validateForm = (req, res, next) => {
    const { error } = formSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message);
        throw ApiError.badRequest(messages.join('. '));
    }
    next();
};

module.exports = validateForm;
