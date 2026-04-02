const ApiError = require('../utils/apiError');

// Middleware d'erreur global — comme EXCEPTION_HANDLER dans DRF settings
// Express reconnaît un middleware d'erreur grâce à ses 4 paramètres (err, req, res, next)
const errorHandler = (err, req, res, next) => {

    // Si c'est une de nos erreurs ApiError → on connaît le status code
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Erreur de validation Mongoose (champ required manquant, etc.)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ errors: messages });
    }

    // ObjectId invalide (ex: /forms/abc → pas un vrai ID MongoDB)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: `ID invalide: ${err.value}` });
    }

    // Erreur inattendue → 500
    console.error('Erreur inattendue:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
};

module.exports = errorHandler;
