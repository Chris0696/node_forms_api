const Joi = require('joi');
const Form = require('../models/Form');
const ApiError = require('../utils/apiError');

// Middleware pour valider les réponses avant de les enregistrer
const validateResponse = async (req, res, next) => {
    // 1. Vérifier que le formulaire existe
    const form = await Form.findById(req.params.id);
    if (!form) {
        throw ApiError.notFound('Formulaire non trouvé');
    }

    // 2. Construire le schéma Joi dynamiquement à partir des champs du formulaire
    // C'est comme créer un Serializer à la volée en DRF
    const answersSchema = {};

    for (const field of form.fields) {
        let rule = Joi.string();

        // Si le champ a des options (select, radio), restreindre les valeurs
        if (field.options && field.options.length > 0) {
            rule = rule.valid(...field.options).messages({
                'any.only': `"${field.label}" doit être parmi: ${field.options.join(', ')}`,
            });
        }

        // Si le champ est requis
        if (field.required) {
            rule = rule.required().messages({
                'any.required': `Le champ "${field.label}" est obligatoire`,
                'string.empty': `Le champ "${field.label}" est obligatoire`,
            });
        } else {
            rule = rule.allow('', null).optional();
        }

        answersSchema[field.label] = rule;
    }

    const schema = Joi.object({
        answers: Joi.object(answersSchema).required().messages({
            'any.required': 'Le champ "answers" est requis',
        }),
    });

    // 3. Valider — abortEarly: false pour renvoyer TOUTES les erreurs d'un coup
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message);
        throw ApiError.badRequest(messages.join('. '));
    }

    // 4. Passer le formulaire au contrôleur
    req.form = form;
    next();
};

module.exports = validateResponse;
