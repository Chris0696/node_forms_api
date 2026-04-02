const Form = require('../models/Form');

// Middleware pour valider les réponses avant de les enregistrer
const validateResponse = async (req, res, next) => {
    try {
        // 1. Vérifier que le formulaire existe
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ error: 'Formulaire non trouvé' });
        }

        const { answers } = req.body;

        // 2. Vérifier que answers est fourni
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ error: 'Le champ "answers" est requis' });
        }

        const errors = [];

        // 3. Vérifier chaque champ du formulaire
        for (const field of form.fields) {
            const answer = answers[field.label];

            // Champ requis mais pas de réponse
            if (field.required && (!answer || answer.trim() === '')) {
                errors.push(`Le champ "${field.label}" est obligatoire`);
            }

            // Si le champ est de type select/radio, vérifier que la valeur est dans les options
            if (answer && field.options.length > 0 && !field.options.includes(answer)) {
                errors.push(`"${answer}" n'est pas une option valide pour "${field.label}". Options: ${field.options.join(', ')}`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // 4. Passer le formulaire au contrôleur (évite de refaire un findById)
        req.form = form;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = validateResponse;
